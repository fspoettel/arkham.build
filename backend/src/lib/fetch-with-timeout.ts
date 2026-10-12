export class FetchTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Fetch timed out after ${timeoutMs}ms`);
    this.name = "FetchTimeoutError";
  }
}

export function fetchWithTimeout(
  input: FetchParameter,
  init?: FetchOptions,
): Promise<Response>;
export function fetchWithTimeout<T>(
  input: FetchParameter,
  init: FetchOptions,
  consumer: (response: Response) => Promise<T>,
): Promise<T>;
export async function fetchWithTimeout<T>(
  input: FetchParameter,
  init: FetchOptions = {},
  consumer?: (response: Response) => Promise<T>,
): Promise<Response | T> {
  const { timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, signal, ...fetchInit } = init;
  const controller = new AbortController();
  let timedOut = false;

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const abort = () => controller.abort();

  if (signal?.aborted) {
    abort();
  } else {
    signal?.addEventListener("abort", abort, { once: true });
  }

  try {
    const response = await fetch(input, {
      ...fetchInit,
      signal: controller.signal,
    });

    // The callback must consume the body before it returns.
    if (consumer) return await consumer(response);
    return response;
  } catch (error) {
    if (timedOut) {
      throw new FetchTimeoutError(timeoutMs);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
    if (consumer) controller.abort();
  }
}

const DEFAULT_FETCH_TIMEOUT_MS = 30_000;

type FetchOptions = NonNullable<Parameters<typeof fetch>[1]> & {
  timeoutMs?: number;
};

type FetchParameter = Parameters<typeof fetch>[0];
