import { z } from "zod";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ArkhamDbOperationError extends ApiError {
  constructor(message: string, responseStatus = 200) {
    super(message, operationErrorStatus(message, responseStatus));
    this.name = "ArkhamDbOperationError";
  }
}

const ArkhamDBApiErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
});

const OAuthErrorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string(),
});

export type ArkhamDBApiError = z.infer<typeof ArkhamDBApiErrorSchema>;
export type OAuthErrorResponse = z.infer<typeof OAuthErrorResponseSchema>;

export function isArkhamDBApiError(value: unknown): value is ArkhamDBApiError {
  return ArkhamDBApiErrorSchema.safeParse(value).success;
}

export function isOAuthErrorResponse(
  value: unknown,
): value is OAuthErrorResponse {
  return OAuthErrorResponseSchema.safeParse(value).success;
}

function operationErrorStatus(message: string, responseStatus: number) {
  if (responseStatus === 404) return 404;
  if (responseStatus >= 500) return responseStatus;
  if (
    message === "Deck is locked." ||
    message === "You can only delete the latest deck."
  ) {
    return 409;
  }
  return 400;
}
