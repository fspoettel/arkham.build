import { z } from "zod";

export const OAuthErrorCodeSchema = z.enum([
  "invalid_request",
  "invalid_client",
  "invalid_grant",
  "invalid_scope",
  "unauthorized_client",
  "unsupported_grant_type",
  "unsupported_response_type",
]);

export const OAuthErrorResponseSchema = z
  .object({
    error: OAuthErrorCodeSchema,
    error_description: z.string(),
  })
  .strict();

export const OAuthAuthorizationQuerySchema = z.object({
  response_type: z
    .string()
    .optional()
    .meta({ examples: ["code"] }),
  client_id: z
    .string()
    .optional()
    .meta({
      examples: ["019c1234-5678-7000-8000-000000000000"],
    }),
  redirect_uri: z
    .string()
    .optional()
    .meta({
      examples: ["https://example.com/oauth/callback"],
    }),
  scope: z
    .string()
    .optional()
    .meta({
      examples: ["profile:read decks:read"],
    }),
  state: z
    .string()
    .optional()
    .meta({ examples: ["opaque-client-state"] }),
  code_challenge: z
    .string()
    .optional()
    .meta({
      description: "Optional PKCE S256 code challenge",
      examples: ["E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"],
      minLength: 43,
      maxLength: 43,
      pattern: "^[A-Za-z0-9_-]{43}$",
    }),
  code_challenge_method: z
    .string()
    .optional()
    .meta({
      description: "PKCE code challenge method; only S256 is supported",
      enum: ["S256"],
      examples: ["S256"],
    }),
});

const OAuthClientIdSchema = z.uuid().meta({
  description: "Confidential OAuth client identifier",
  examples: ["019c1234-5678-7000-8000-000000000000"],
});

const OAuthClientSecretSchema = z
  .string()
  .min(1)
  .meta({
    description: "Confidential OAuth client secret",
    examples: ["ab_cs_..."],
  });

const OAuthClientIdFormFieldSchema = OAuthClientIdSchema.optional();
const OAuthClientSecretFormFieldSchema = OAuthClientSecretSchema.optional();

export const OAuthTokenFormSchema = z
  .object({
    grant_type: z
      .string()
      .optional()
      .meta({
        examples: ["authorization_code"],
      }),
    client_id: OAuthClientIdFormFieldSchema,
    client_secret: OAuthClientSecretFormFieldSchema,
    code: z
      .string()
      .optional()
      .meta({ examples: ["ab_code_..."] }),
    redirect_uri: z
      .string()
      .optional()
      .meta({
        examples: ["https://example.com/oauth/callback"],
      }),
    code_verifier: z
      .string()
      .optional()
      .meta({
        description: "PKCE verifier for an authorization code bound to PKCE",
        examples: ["dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"],
        minLength: 43,
        maxLength: 128,
        pattern: "^[A-Za-z0-9._~-]{43,128}$",
      }),
    refresh_token: z
      .string()
      .optional()
      .meta({ examples: ["ab_rt_..."] }),
    scope: z.string().optional(),
  })
  .strict();

export const OAuthAuthorizationCodeTokenRequestSchema = z
  .object({
    grant_type: z.literal("authorization_code"),
    client_id: OAuthClientIdSchema,
    client_secret: OAuthClientSecretSchema,
    code: z
      .string()
      .min(1)
      .meta({ examples: ["ab_code_..."] }),
    redirect_uri: z
      .string()
      .min(1)
      .meta({
        description:
          "Exact redirect URI supplied to the authorization endpoint",
        examples: ["https://example.com/oauth/callback"],
      }),
    code_verifier: z
      .string()
      .optional()
      .meta({
        description: "PKCE verifier for an authorization code bound to PKCE",
        examples: ["dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"],
        minLength: 43,
        maxLength: 128,
        pattern: "^[A-Za-z0-9._~-]{43,128}$",
      }),
  })
  .strict();

export const OAuthRefreshTokenRequestSchema = z
  .object({
    grant_type: z.literal("refresh_token"),
    client_id: OAuthClientIdSchema,
    client_secret: OAuthClientSecretSchema,
    refresh_token: z
      .string()
      .min(1)
      .meta({ examples: ["ab_rt_..."] }),
  })
  .strict();

export const OAuthTokenResponseSchema = z
  .object({
    token_type: z.literal("Bearer"),
    access_token: z.string().startsWith("ab_at_"),
    expires_in: z.literal(3600),
    refresh_token: z.string().startsWith("ab_rt_"),
    scope: z.string(),
  })
  .strict();

export const OAuthRevocationFormSchema = z
  .object({
    client_id: OAuthClientIdFormFieldSchema,
    client_secret: OAuthClientSecretFormFieldSchema,
    token: z
      .string()
      .optional()
      .meta({ examples: ["ab_rt_..."] }),
    token_type_hint: z
      .string()
      .optional()
      .meta({
        examples: ["refresh_token"],
      }),
  })
  .strict();

export const OAuthRevocationRequestSchema = z
  .object({
    client_id: OAuthClientIdSchema,
    client_secret: OAuthClientSecretSchema,
    token: z
      .string()
      .min(1)
      .meta({ examples: ["ab_rt_..."] }),
    token_type_hint: z
      .string()
      .min(1)
      .max(64)
      .optional()
      .meta({
        description: "Optional access_token or refresh_token lookup hint",
        examples: ["refresh_token"],
      }),
  })
  .strict();
