import { createHash } from "node:crypto";
import type { Transaction } from "kysely";
import type { Database } from "../../../db/db.ts";
import type { DB } from "../../../db/schema.types.ts";
import {
  generateOAuthAccessToken,
  generateOAuthRefreshToken,
  hashOAuthCredential,
} from "../../../lib/oauth/crypto.ts";
import {
  lockActiveOAuthClient,
  verifyOAuthClientCredentials,
} from "./client-authentication.ts";
import { OAuthTokenError } from "./errors.ts";
import { revokeOAuthGrantTokens } from "./revocation.ts";
import { canonicalizeOAuthScopes } from "./scopes.ts";

export const OAUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS = 60 * 60;
export const OAUTH_REFRESH_TOKEN_LIFETIME_MS = 180 * 24 * 60 * 60 * 1000;

const OAUTH_ACCESS_TOKEN_LIFETIME_MS =
  OAUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS * 1000;
const PKCE_CODE_VERIFIER_PATTERN = /^[A-Za-z0-9._~-]{43,128}$/;

type AuthorizationCodeExchangeInput = {
  clientId: string;
  clientSecret: string;
  code: string;
  codeVerifier: string | undefined;
  redirectUri: string;
};

type RefreshTokenExchangeInput = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type OAuthTokenResult = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scopes: string[];
};

export async function exchangeOAuthAuthorizationCode(
  db: Database,
  input: AuthorizationCodeExchangeInput,
): Promise<OAuthTokenResult> {
  const verifiedSecretHash = await verifyOAuthClientCredentials(db, input);

  return await db.transaction().execute(async (tx) => {
    await lockActiveOAuthClient(tx, input.clientId, verifiedSecretHash);

    const codeHash = hashOAuthCredential(input.code);
    const authorizationCodeReference = await tx
      .selectFrom("oauth_authorization_code")
      .select("oauth_grant_id")
      .where("code_hash", "=", codeHash)
      .executeTakeFirst();

    if (!authorizationCodeReference) {
      throw invalidAuthorizationCode();
    }

    const grant = await tx
      .selectFrom("oauth_grant")
      .select(["id", "oauth_client_id"])
      .where("id", "=", authorizationCodeReference.oauth_grant_id)
      .forUpdate()
      .executeTakeFirst();

    if (!grant || grant.oauth_client_id !== input.clientId) {
      throw invalidAuthorizationCode();
    }

    const authorizationCode = await tx
      .selectFrom("oauth_authorization_code")
      .select([
        "code_challenge",
        "expires_at",
        "id",
        "redirect_uri",
        "revoked_at",
        "scopes",
        "used_at",
      ])
      .where("code_hash", "=", codeHash)
      .where("oauth_grant_id", "=", grant.id)
      .forUpdate()
      .executeTakeFirst();

    const now = new Date();

    if (
      !authorizationCode ||
      authorizationCode.used_at != null ||
      authorizationCode.revoked_at != null ||
      authorizationCode.expires_at <= now ||
      authorizationCode.redirect_uri !== input.redirectUri ||
      !matchesPkceBinding(authorizationCode.code_challenge, input.codeVerifier)
    ) {
      throw invalidAuthorizationCode();
    }

    const scopes = canonicalizeOAuthScopes(authorizationCode.scopes);

    await tx
      .updateTable("oauth_authorization_code")
      .set({ used_at: now, updated_at: now })
      .where("id", "=", authorizationCode.id)
      .where("used_at", "is", null)
      .executeTakeFirstOrThrow();

    return await issueOAuthTokenPair(tx, grant.id, scopes, now);
  });
}

export async function exchangeOAuthRefreshToken(
  db: Database,
  input: RefreshTokenExchangeInput,
): Promise<OAuthTokenResult> {
  const verifiedSecretHash = await verifyOAuthClientCredentials(db, input);

  const token = await db.transaction().execute(async (tx) => {
    await lockActiveOAuthClient(tx, input.clientId, verifiedSecretHash);

    const refreshTokenHash = hashOAuthCredential(input.refreshToken);
    const refreshTokenReference = await tx
      .selectFrom("oauth_refresh_token")
      .select("oauth_grant_id")
      .where("token_hash", "=", refreshTokenHash)
      .executeTakeFirst();

    if (!refreshTokenReference) {
      throw invalidRefreshToken();
    }

    const grant = await tx
      .selectFrom("oauth_grant")
      .select(["id", "oauth_client_id"])
      .where("id", "=", refreshTokenReference.oauth_grant_id)
      .forUpdate()
      .executeTakeFirst();

    if (!grant || grant.oauth_client_id !== input.clientId) {
      throw invalidRefreshToken();
    }

    const refreshToken = await tx
      .selectFrom("oauth_refresh_token")
      .select(["expires_at", "id", "revoked_at", "rotated_at", "scopes"])
      .where("token_hash", "=", refreshTokenHash)
      .where("oauth_grant_id", "=", grant.id)
      .executeTakeFirst();
    const now = new Date();

    if (!refreshToken) throw invalidRefreshToken();

    if (refreshToken.rotated_at != null) {
      await revokeOAuthGrantTokens(tx, grant.id, now);
      return undefined;
    }

    if (refreshToken.revoked_at != null || refreshToken.expires_at <= now) {
      throw invalidRefreshToken();
    }

    const scopes = canonicalizeOAuthScopes(refreshToken.scopes);

    await tx
      .updateTable("oauth_refresh_token")
      .set({
        last_used_at: now,
        rotated_at: now,
        updated_at: now,
      })
      .where("id", "=", refreshToken.id)
      .executeTakeFirstOrThrow();

    return await issueOAuthTokenPair(tx, grant.id, scopes, now);
  });

  if (!token) throw invalidRefreshToken();
  return token;
}

async function issueOAuthTokenPair(
  tx: Transaction<DB>,
  grantId: string,
  scopes: string[],
  now: Date,
): Promise<OAuthTokenResult> {
  const refreshToken = generateOAuthRefreshToken();
  const refreshTokenExpiresAt = new Date(
    now.getTime() + OAUTH_REFRESH_TOKEN_LIFETIME_MS,
  );
  const accessToken = generateOAuthAccessToken();
  const accessTokenExpiresAt = new Date(
    now.getTime() + OAUTH_ACCESS_TOKEN_LIFETIME_MS,
  );

  const storedRefreshToken = await tx
    .insertInto("oauth_refresh_token")
    .values({
      expires_at: refreshTokenExpiresAt,
      oauth_grant_id: grantId,
      scopes,
      token_hash: hashOAuthCredential(refreshToken),
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  await tx
    .insertInto("oauth_access_token")
    .values({
      expires_at: accessTokenExpiresAt,
      oauth_grant_id: grantId,
      oauth_refresh_token_id: storedRefreshToken.id,
      scopes,
      token_hash: hashOAuthCredential(accessToken),
    })
    .executeTakeFirstOrThrow();

  return {
    accessToken,
    expiresIn: OAUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    refreshToken,
    scopes,
  };
}

function matchesPkceBinding(
  codeChallenge: string | null | undefined,
  codeVerifier: string | null | undefined,
) {
  if (codeChallenge == null) return codeVerifier == null;
  if (codeVerifier == null || !PKCE_CODE_VERIFIER_PATTERN.test(codeVerifier)) {
    return false;
  }

  return (
    codeChallenge ===
    createHash("sha256").update(codeVerifier, "ascii").digest("base64url")
  );
}

function invalidAuthorizationCode() {
  return new OAuthTokenError(
    "invalid_grant",
    "Authorization code is invalid or expired",
  );
}

function invalidRefreshToken() {
  return new OAuthTokenError(
    "invalid_grant",
    "Refresh token is invalid or expired",
  );
}
