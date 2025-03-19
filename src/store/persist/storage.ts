import { get, set } from "idb-keyval";
import type { StoreState } from "../slices";

export const VERSION = 6;

type StoredState<T extends Partial<StoreState>> = {
  version: number;
  state: T;
};

interface Storage<T extends Partial<StoreState>> {
  storageKey: string;
  get(): Promise<StoredState<T> | undefined>;
  partialize(state: StoreState): T;
  set(state: StoreState): Promise<void>;
}

export function makeStorageAdapter<T extends Partial<StoreState>>(
  storageKey: string,
  partialize: (state: StoreState) => T,
): Storage<T> {
  return {
    storageKey,
    partialize,
    async get(): Promise<StoredState<T> | undefined> {
      if (import.meta.env.MODE === "test") return undefined;

      const data = await get(storageKey);

      if (!data) return undefined;
      return JSON.parse(data);
    },
    set(state: StoreState) {
      if (import.meta.env.MODE === "test") return Promise.resolve();

      console.debug(`[persist] write ${storageKey}`);

      return set(
        storageKey,
        JSON.stringify({
          state: partialize(state),
          version: VERSION,
        }),
      );
    },
  };
}
