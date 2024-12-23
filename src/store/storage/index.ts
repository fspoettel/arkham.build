import { time, timeEnd } from "@/utils/time";
import type {
  PersistOptions,
  PersistStorage,
  StorageValue,
} from "zustand/middleware";
import type { StoreState } from "../slices";
import { getInitialAppState } from "../slices/app";
import { getInitialConnectionsState } from "../slices/connections";
import { getInitialDataState } from "../slices/data";
import { getInitialMetadata } from "../slices/metadata";
import { getInitialSettings } from "../slices/settings";
import { getInitialSharingState } from "../slices/sharing";
import { IndexedDBAdapter } from "./indexeddb-adapter";
import v1Tov2 from "./migrations/0001-add-deck-history";
import v2Tov3 from "./migrations/0002-add-client-id";
import v3Tov4 from "./migrations/0003-add-lists-setting";
import v4Tov5 from "./migrations/0004-fix-investigator-default";
import v5toV6 from "./migrations/0005-add-view-mode";
import type { Val } from "./storage.types";

const indexedDBAdapter = new IndexedDBAdapter();

export const VERSION = 6;

// use this flag to disable rehydration during dev.
const SKIP_HYDRATION = false;

export function migrate(persisted: StoreState, version: number): StoreState {
  const state = structuredClone(persisted);

  if (version < 2) {
    console.debug("[persist] migrate store: ", 2);
    v1Tov2(state, version);
  }

  if (version < 3) {
    console.debug("[persist] migrate store: ", 3);
    v2Tov3(state, version);
  }

  if (version < 4) {
    console.debug("[persist] migrate store: ", 4);
    v3Tov4(state, version);
  }

  if (version < 5) {
    console.debug("[persist] migrate store: ", 5);
    v4Tov5(state, version);
  }

  if (version < 6) {
    console.debug("[persist] migrate store: ", 6);
    v5toV6(state, version);
  }

  return state;
}

export function partialize(state: StoreState) {
  return {
    connections: state.connections,
    data: state.data,
    deckEdits: state.deckEdits,
    metadata: state.metadata,
    settings: state.settings,
    sharing: state.sharing,
    app: state.app,
  } as StoreState;
}

export const storageConfig: PersistOptions<StoreState, Val> = {
  name: "deckbuilder",
  storage: createCustomStorage(),
  version: VERSION,
  skipHydration: import.meta.env.MODE === "test",
  migrate(persisted, version) {
    return migrate(persisted as StoreState, version);
  },
  partialize,
  onRehydrateStorage: () => {
    time("hydration");
    return (state: StoreState | undefined, error?: unknown) => {
      if (error) console.error("Error during hydration", error);
      if (state) state.setHydrated();
      timeEnd("hydration");
    };
  },
};

function createCustomStorage(): PersistStorage<Val> | undefined {
  return {
    async getItem(name) {
      if (SKIP_HYDRATION) return null;

      const [metadata, appdata] = await Promise.all([
        indexedDBAdapter.getMetadata(name),
        indexedDBAdapter.getAppdata(name),
      ]);

      if (!metadata && !appdata) return null;

      const val: StorageValue<Val> = {
        state: {
          app: appdata?.state?.app ?? getInitialAppState(),
          connections:
            appdata?.state?.connections ?? getInitialConnectionsState(),
          data: appdata?.state?.data ?? getInitialDataState().data,
          deckEdits: appdata?.state?.deckEdits ?? {},
          metadata: metadata?.state?.metadata ?? getInitialMetadata(),
          settings: appdata?.state?.settings ?? getInitialSettings(),
          sharing: appdata?.state?.sharing ?? getInitialSharingState(),
        },
        version: Math.min(metadata?.version ?? 1, appdata?.version ?? 1),
      };

      return val;
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
