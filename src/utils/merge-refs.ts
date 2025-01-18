import type { Ref } from "react";

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  return (value) => {
    const cleanups = refs.reduce<VoidFunction[]>((accumulator, ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(value);
        if (typeof cleanup === "function") {
          accumulator.push(cleanup);
        }
      } else if (ref) {
        // biome-ignore lint/suspicious/noExplicitAny: safe.
        (ref as any).current = value;
      }

      return accumulator;
    }, []);

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  };
}
