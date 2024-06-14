import type { EqualityFn } from "reselect";
import { createSelectorCreator, lruMemoize } from "reselect";

export const createCustomEqualSelector = (equalFn: EqualityFn) =>
  createSelectorCreator(lruMemoize, equalFn);

export const createDebugSelector = createSelectorCreator(lruMemoize, {
  equalityCheck: (previousVal, currentVal) => {
    const rv = currentVal === previousVal;
    if (!rv) console.log("Selector param value changed", currentVal);
    return rv;
  },
});
