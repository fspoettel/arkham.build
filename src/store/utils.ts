/**
 * Transform an array of arkhamdb-json-data into an index { [code]: data }.
 */
export function indexedByCode<T extends { code: string }>(arr: T[]) {
  return arr.reduce(
    (acc, curr) => {
      acc[curr.code] = curr;
      return acc;
    },
    {} as Record<string, T>,
  );
}
