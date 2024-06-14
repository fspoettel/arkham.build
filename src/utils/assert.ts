export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`assertion failed: ${message}`);
}

export function isDefined(value: unknown): value is NonNullable<typeof value> {
  return value != null;
}
