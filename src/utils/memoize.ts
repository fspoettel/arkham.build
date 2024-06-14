/* COPIED FROM LODASH. FIXME: TYPES */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function memoize<T>(func: T, resolver?: any): T {
  if (
    typeof func !== "function" ||
    (resolver != null && typeof resolver !== "function")
  ) {
    throw new TypeError("Expected a function");
  }
  const memoized = function (this: any, ...args: any[]) {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || Map)();
  return memoized as T;
}

memoize.Cache = Map;

export default memoize;
