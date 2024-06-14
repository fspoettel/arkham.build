import { Index } from "./types";

/**
 * Add a code to an index key, creating the index and key on first occurrence.
 */
export function setInIndex(
  indexes: Record<string, Index<any>>,
  indexName: string,
  code: string,
  value: string | number,
  indexValue = 1,
) {
  indexes[indexName] ??= {};

  if (indexes[indexName][value]) {
    indexes[indexName][value][code] = indexValue;
  } else {
    indexes[indexName][value] = { [code]: indexValue };
  }
}
