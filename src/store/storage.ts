import { createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { StoreState } from "./slices";

const indexedDBStorage: StateStorage = {
  async getItem(name: string) {
    // remove comment to test the initial store sync.
    // return Promise.resolve(null);
    return (await get(name)) ?? null;
  },
  async setItem(name: string, value: string) {
    return Promise.resolve();
    return set(name, value);
  },
  async removeItem(name: string) {
    return del(name);
  },
};

export const storageConfig = {
  name: "deckbuilder",
  storage: createJSONStorage(() => indexedDBStorage),
  version: 1,
  partialize(state: StoreState) {
    return {
      metadata: state.metadata,
      lookupTables: state.lookupTables,
    };
  },
  onRehydrateStorage: () => {
    console.time("hydration");
    return () => console.timeEnd("hydration");
  },
};
