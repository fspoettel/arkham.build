import { PARALLEL_INVESTIGATORS } from "@/data/constants";
import { Index } from "./schema";

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

/**
 * Add a code to an index key, creating the key on first occurence.
 */
export function setInIndex(index: Index, code: string, value: string | number) {
  if (index[value]) {
    index[value][code] = true;
  } else {
    index[value] = { [code]: true };
  }
}

/**
 * Split multi value card properties. expected format: `Item. Tool.`
 */
export function splitMultiValue(s?: string) {
  return (s ?? "")
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s);
}

/**
 * Check if a card has parallel front/back.
 */
export function hasParallel(code: string) {
  return PARALLEL_INVESTIGATORS[code] != null;
}

/**
 * Check if a card is a parallel front/back.
 */
export function isParallel(code: string) {
  return Object.values(PARALLEL_INVESTIGATORS).includes(code);
}
