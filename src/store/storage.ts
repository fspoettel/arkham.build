import { createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

const indexedDBStorage: StateStorage = {
  async getItem(name: string) {
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
  name: "deckbuilder",
  storage: createJSONStorage(() => indexedDBStorage),
  version: 1,
  onRehydrateStorage: () => {
    console.time("hydration");
    return () => console.timeEnd("hydration");
  },
};
