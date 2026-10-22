import {
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
} from "@arkham-build/shared";
import { Hono } from "hono";
import {
  getAccountIdentityByEmail,
  getAccountIdentityByUsername,
} from "../../../lib/auth/account-identities.ts";
import { deleteSessionsByAccountId } from "../../../lib/auth/sessions.ts";
import type { HonoEnv } from "../../../lib/hono-env.ts";
import { zodValidator } from "../../../lib/validation.ts";
import {
  assertVerificationTokenCooldown,
  isEmail,
  throwInvalidResetTokenError,
} from "../lib/assertions.ts";
import { generateRandomToken, hashPassword, hashToken } from "../lib/crypto.ts";
import { passwordResetEmailTemplate } from "../lib/email-templates.ts";
import {
  lockEmailAccountIdentity,
  updateAccountIdentityPasswordHash,
  updateAccountIdentityPendingEmail,
} from "../queries/identities.ts";
import {
  consumeVerificationToken,
  deleteVerificationTokensByAccountIdentityId,
  getVerificationTokenByHash,
  replaceVerificationToken,
} from "../queries/verification-tokens.ts";

const routes = new Hono<HonoEnv>();

routes.post(
  "/forgot-password",
  zodValidator("json", ForgotPasswordRequestSchema),
  async (c) => {
    const { emailOrUsername } = c.req.valid("json");
    const config = c.get("config");
    const db = c.get("db");
    const dispatcher = c.get("dispatcher");

    const accountIdentity = isEmail(emailOrUsername)
      ? await getAccountIdentityByEmail(db, emailOrUsername)
      : await getAccountIdentityByUsername(db, "email", emailOrUsername);

    const email = accountIdentity?.email;

    if (accountIdentity?.verified_at && email) {
      const token = generateRandomToken();

      await db.transaction().execute(async (tx) => {
        const identity = await lockEmailAccountIdentity(tx, accountIdentity.id);
        if (
          !identity?.verified_at ||
          identity.email !== email ||
          identity.password_hash !== accountIdentity.password_hash
        ) {
          return;
        }

        await assertVerificationTokenCooldown(tx, email, "password_reset");
        await replaceVerificationToken(tx, {
          accountIdentityId: accountIdentity.id,
          email,
          tokenHash: hashToken(token),
          tokenType: "password_reset",
          expiryHours: config.PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
        });

        const template = passwordResetEmailTemplate({
          resetUrl: `${config.FRONTEND_URL}/auth/reset-password#token=${encodeURIComponent(
            token,
          )}`,
        });

        await dispatcher.enqueueEmail(
          { subject: template.subject, text: template.text, to: email },
          { tx },
        );
      });
    }

    return new Response(null, { status: 200 });
  },
);

routes.post(
  "/reset-password",
  zodValidator("json", ResetPasswordRequestSchema),
  async (c) => {
    const { token, password } = c.req.valid("json");
    const db = c.get("db");

    const tokenHash = hashToken(token);

    const existingToken = await getVerificationTokenByHash(
      db,
      tokenHash,
      "password_reset",
    );

    if (!existingToken?.account_identity_id) {
      throwInvalidResetTokenError();
    }

    const accountIdentityId = existingToken.account_identity_id;
    const passwordHash = await hashPassword(password);

    await db.transaction().execute(async (tx) => {
      const accountIdentity = await lockEmailAccountIdentity(
        tx,
        accountIdentityId,
      );
      const verificationToken = await consumeVerificationToken(
        tx,
        tokenHash,
        "password_reset",
      );

      if (
        !verificationToken ||
        !accountIdentity?.verified_at ||
        accountIdentity.email !== verificationToken.email
      ) {
        throwInvalidResetTokenError();
      }

      await updateAccountIdentityPasswordHash(
        tx,
        accountIdentity.id,
        passwordHash,
      );
      await updateAccountIdentityPendingEmail(tx, accountIdentity.id, null);
      await deleteVerificationTokensByAccountIdentityId(tx, accountIdentity.id);
      await deleteSessionsByAccountId(tx, accountIdentity.account_id);
    });

    return new Response(null, { status: 200 });
  },
);

export default routes;
