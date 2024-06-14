/**
 * Transform an array of arkhamdb-json-data into a map { [code]: data }.
 */
export function mappedByCode<T extends { code: string }>(arr: T[]) {
  return arr.reduce(
    (acc, curr) => {
      acc[curr.code] = curr;
      return acc;
    },
    {} as Record<string, T>,
  );
}
