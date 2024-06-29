import type {
  PersistOptions,
  PersistStorage,
  StorageValue,
} from "zustand/middleware";

import { time, timeEnd } from "@/utils/time";
import type { StoreState } from "../slices";
import { getInitialDataState } from "../slices/data";
import { getInitialMetadata } from "../slices/metadata";
import { getInitialSettings } from "../slices/settings";
import { IndexedDBAdapter } from "./indexeddb-adapter";
import migrateV1 from "./migrations/v1";
import type { Val } from "./storage.types";

const indexedDBAdapter = new IndexedDBAdapter();

const VERSION = 2;

// use this flag to disable rehydration during dev.
const SKIP_HYDRATION = false;

export const storageConfig: PersistOptions<StoreState, Val> = {
  name: "deckbuilder",
  storage: createCustomStorage(),
  version: VERSION,
  skipHydration: import.meta.env.MODE === "test",
  migrate(persisted, version) {
    const state = persisted as StoreState;
    if (version < 2) {
      console.debug("[persist] migrate store: ", version);
      migrateV1(state, version);
    }
    return state;
  },
  partialize(state: StoreState) {
    return {
      data: state.data,
      deckEdits: state.deckEdits,
      metadata: state.metadata,
      settings: state.settings,
    };
  },
  onRehydrateStorage: () => {
    time("hydration");
    return (state: StoreState | undefined, error?: unknown) => {
      if (state) state.setHydrated();
      if (error) console.error(error);
      timeEnd("hydration");
    };
  },
};

function createCustomStorage(): PersistStorage<Val> | undefined {
  return {
    async getItem(name) {
      if (SKIP_HYDRATION) return null;

      try {
        const [metadata, appdata] = await Promise.all([
          indexedDBAdapter.getMetadata(name),
          indexedDBAdapter.getAppdata(name),
        ]);

        if (!metadata && !appdata) return null;

        const val: StorageValue<Val> = {
          state: {
            data: appdata?.state?.data ?? getInitialDataState().data,
            deckEdits: appdata?.state?.deckEdits ?? {},
            metadata: metadata?.state?.metadata ?? getInitialMetadata(),
            settings: appdata?.state?.settings ?? getInitialSettings(),
          },
          version: Math.min(metadata?.version ?? 1, appdata?.version ?? 1),
        };

        return val;
      } catch (err) {
        indexedDBAdapter.removeIdentifier(name);
        console.error("error during hydration:", err);
        return null;
      }
    },

    async setItem(name, value) {
      try {
        await indexedDBAdapter.setAppdata(name, value);
        await indexedDBAdapter.setMetadata(name, value);
      } catch (err) {
        console.error("could not persist store data:", err);
      }
    },

    async removeItem(name) {
      await Promise.all([
        indexedDBAdapter.removeAppdata(name),
        indexedDBAdapter.removeMetadata(name),
      ]);
    },
  };
}
