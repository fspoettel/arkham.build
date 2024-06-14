import { Coded } from "@/store/graphql/types";

/**
 * Transform an array of arkhamdb-json-data into a map { [code]: data }.
 */
export function mappedByCode<T extends Coded, S extends Coded = T>(
  arr: T[],
  mapper?: (t: T) => void,
) {
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

export function mappedById<T extends { id: number }>(arr: T[]) {
  return arr.reduce(
    (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    },
    {} as Record<string, T>,
  );
}
