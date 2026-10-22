import type { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { z } from "zod";
import type { HonoEnv } from "../../../../lib/hono-env.ts";
import { OAuthFlowError, type OAuthProvider } from "../../../../lib/oauth.ts";
import { hashToken } from "../crypto.ts";

const OAuthIntentSchema = z.enum(["login", "signup", "connect"]);

const OAuthContextSchema = z.object({
  accountId: z.string().optional(),
  sessionId: z.uuid().optional(),
  intent: OAuthIntentSchema,
  returnTo: z.string(),
  successReturnTo: z.string().optional(),
});

const OAuthStateCookieSchema = OAuthContextSchema.extend({
  state: z.string(),
});

export type OAuthContext = z.infer<typeof OAuthContextSchema>;
type OAuthStateCookie = z.infer<typeof OAuthStateCookieSchema>;

const OAUTH_STATE_COOKIE_NAME = "arkham-build-oauth-state";
const OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60;

export async function setOAuthStateCookie<E extends HonoEnv>(
  c: Context<E>,
  provider: OAuthProvider,
  oauthContext: OAuthContext,
  state: string,
) {
  if (oauthContext.intent === "connect") {
    if (!oauthContext.accountId || !oauthContext.sessionId) {
      throw new OAuthFlowError("invalid_state");
    }

    const session = await c
      .get("db")
      .updateTable("session")
      .set({
        oauth_connect_state_hash: hashToken(state),
        oauth_connect_expires_at: new Date(
          Date.now() + OAUTH_STATE_MAX_AGE_SECONDS * 1000,
        ),
      })
      .where("id", "=", oauthContext.sessionId)
      .where("account_id", "=", oauthContext.accountId)
      .where("expires_at", ">", new Date())
      .returning("id")
      .executeTakeFirst();

    if (!session) throw new OAuthFlowError("invalid_state");
  }

  await setSignedCookie(
    c,
    OAUTH_STATE_COOKIE_NAME,
    JSON.stringify({
      ...oauthContext,
      state,
    }),
    c.get("config").SESSION_SECRET,
    {
      httpOnly: true,
      maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
      path: provider.getCallbackPath(c),
      sameSite: "Lax",
      secure: c.get("config").NODE_ENV === "production",
    },
  );
}

export async function getOAuthContext(
  c: Context,
): Promise<OAuthContext | null> {
  try {
    const oauthState = await getOAuthStateCookie(c);

    if (!oauthState) {
      return null;
    }

    return OAuthContextSchema.parse(oauthState);
  } catch {
    return null;
  }
}

export async function validateOAuthState(
  c: Context<HonoEnv>,
  provider: OAuthProvider,
  state: string | undefined,
): Promise<OAuthStateCookie> {
  const oauthState = await getOAuthStateCookie(c);
  deleteCookie(c, OAUTH_STATE_COOKIE_NAME, {
    path: provider.getCallbackPath(c),
  });

  if (!state || !oauthState) {
    throw new OAuthFlowError("invalid_state");
  }

  if (oauthState.state !== state) {
    throw new OAuthFlowError("invalid_state");
  }

  if (oauthState.intent === "connect") {
    if (!oauthState.accountId || !oauthState.sessionId) {
      throw new OAuthFlowError("invalid_state");
    }

    const now = new Date();
    const session = await c
      .get("db")
      .selectFrom("session")
      .select("id")
      .where("id", "=", oauthState.sessionId)
      .where("account_id", "=", oauthState.accountId)
      .where("expires_at", ">", now)
      .where("oauth_connect_state_hash", "=", hashToken(state))
      .where("oauth_connect_expires_at", ">", now)
      .executeTakeFirst();

    if (!session) throw new OAuthFlowError("invalid_state");
  }

  return oauthState;
}

async function getOAuthStateCookie(
  c: Context,
): Promise<OAuthStateCookie | null> {
  const signedState = await getSignedCookie(
    c,
    c.get("config").SESSION_SECRET,
    OAUTH_STATE_COOKIE_NAME,
  );

  if (typeof signedState !== "string") {
    return null;
  }

  return parseOAuthStateCookie(signedState);
}

function parseOAuthStateCookie(signedState: string): OAuthStateCookie {
  try {
    return OAuthStateCookieSchema.parse(JSON.parse(signedState));
  } catch {
    throw new OAuthFlowError("invalid_state");
  }
}
