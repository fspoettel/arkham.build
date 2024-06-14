export function isEmpty(
  x: Array<unknown> | Record<string, unknown> | null | undefined,
): boolean {
  if (x == null) return true;
  if (Array.isArray(x)) return x.length === 0;
  return Object.keys(x).length === 0;
}
