import type {
  PersistOptions,
  PersistStorage,
  StorageValue,
} from "zustand/middleware";

import type { StoreState } from "../slices";
import { getInitialDecksState } from "../slices/decks";
import { getInitialMetadata } from "../slices/metadata";
import { getInitialSettings } from "../slices/settings";
import { IndexedDBAdapter } from "./indexeddb-adapter";
import type { Val } from "./types";

const indexedDBAdapter = new IndexedDBAdapter();

const VERSION = 2;

// use this flag to disable rehydration during dev.
const SKIP_HYDRATION = false;

export const storageConfig: PersistOptions<StoreState, Val> = {
  name: "deckbuilder",
  storage: createCustomStorage(),
  version: VERSION,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate(persistedState: any, version) {
    if (version === 1) {
      if (!persistedState.decks) {
        persistedState.decks = { local: {} };
      }
    }

    return persistedState;
  },
  partialize(state: StoreState) {
    return {
      decks: state.decks,
      metadata: state.metadata,
      settings: state.settings,
    };
  },
  onRehydrateStorage: () => {
    console.time("[performance] hydration");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (state: StoreState | undefined, error?: unknown) => {
      if (state) state.setHydrated();
      if (error) console.error(error);
      console.timeEnd("[performance] hydration");
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
            decks: appdata?.state?.decks ?? getInitialDecksState(),
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
