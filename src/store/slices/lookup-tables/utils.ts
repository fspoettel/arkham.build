import { LookupTable } from "./types";

/**
 * Add a code to an index key, creating the index and key on first occurrence.
 */
export function setInLut<T extends string | number>(
  code: keyof LookupTable<T>[T] | string,
  index: LookupTable<T>,
  key: T,
) {
  if (index[key]) {
    index[key][code] = 1;
  } else {
    index[key] = { [code]: 1 as const };
  }
}
