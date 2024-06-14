import { createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> =>
    get(name).then((v) => v ?? null),
  setItem: async (name: string, value: string): Promise<void> =>
    set(name, value),
  removeItem: async (name: string): Promise<void> => del(name),
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
