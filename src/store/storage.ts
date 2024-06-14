import { createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { StoreState } from "./slices";
import { DATABASE_NAME } from "./constants";

const indexedDBStorage: StateStorage = {
  async getItem(name: string) {
    // remove comment to test indexes.
    // return Promise.resolve(null);
    return (await get(name)) ?? null;
  },
  async setItem(name: string, value: string) {
    return set(name, value);
  },
  async removeItem(name: string) {
    return del(name);
  },
};

export const storageConfig = {
  name: DATABASE_NAME,
  storage: createJSONStorage(() => indexedDBStorage),
  version: 1,
  partialize(state: StoreState) {
    return {
      metadata: state.metadata,
      indexes: state.indexes,
    };
  },
  onRehydrateStorage: () => {
    console.time("hydration");
    return () => console.timeEnd("hydration");
  },
};
