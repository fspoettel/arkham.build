/**
 * Transform an array of arkhamdb-json-data into a map { [code]: data }.
 */
export function mappedByCode<
  T extends { code: string },
  S extends { code: string } = T,
>(arr: T[], mapper?: (t: T) => void) {
  return arr.reduce(
    (acc, curr) => {
      if (mapper) mapper(curr);
      // TODO: add type guards.
      acc[curr.code] = curr as unknown as S;
      return acc;
    },
    {} as Record<string, S>,
  );
}
