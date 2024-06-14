import { del, get, set } from "idb-keyval";
import { PersistStorage } from "zustand/middleware";

import { DataVersion } from "./graphql/types";
import { StoreState } from "./slices";
import { LookupTables } from "./slices/lookup-tables/types";
import { Metadata } from "./slices/metadata/types";

type Val = {
  metadata: Metadata;
  lookupTables: LookupTables;
};

function getMetadataKey(name: string) {
  return `${name}_data_version`;
}

export function getDataVersionIdentifier(version?: DataVersion) {
  return version
    ? `${version.locale}_${version.cards_updated_at}_${version.translation_updated_at}`
    : undefined;
}

function createCustomStorage(): PersistStorage<Val> | undefined {
  return {
    async getItem(name) {
      const item = await get(name);

      if (item == null) {
        console.debug(`[persist] no data found in storage.`);
        // the item may have been deleted by the user, ensure storage key is purged as well.
        localStorage.removeItem(getMetadataKey(name));
        return null;
      }

      let parsed;
      try {
        parsed = JSON.parse(item);
      } catch (err) {
        console.error(err);
        return null;
      }

      const version = getDataVersionIdentifier(
        parsed?.state?.metadata?.dataVersion,
      );
      if (version) {
        console.debug(`[persist] rehydrated card version: ${version}`);
        localStorage.setItem(getMetadataKey(name), version);
        return parsed;
      }

      console.debug(`[persist] stored data appers to be malformed.`);
      localStorage.removeItem(getMetadataKey(name));
      return null;
    },

    async setItem(name, value) {
      // TODO:support storing lookup tables and decks in separate IDB stores.
      // TODO: support translated data.
      const persistedVersion = localStorage.getItem(getMetadataKey(name));
      const currentVersion = getDataVersionIdentifier(
        value.state.metadata.dataVersion,
      );
      const lookupTablesVersion = value.state.lookupTables.dataVersion;

      if (
        !currentVersion ||
        !lookupTablesVersion ||
        lookupTablesVersion !== currentVersion
      ) {
        console.debug("[persist] skip: store is uninitialized.");
        return;
      }

      if (currentVersion === persistedVersion) {
        console.debug(`[persist] skip: stored data is in sync.`);
        return;
      } else {
        console.debug(`[persist] save: stored version is out of sync.`);
        localStorage.setItem(`${name}_data_version`, currentVersion);
        return set(name, JSON.stringify(value));
      }
    },
    async removeItem(name) {
      return del(name);
    },
  };
}

export const storageConfig = {
  name: "deckbuilder",
  storage: createCustomStorage(),
  version: 1,
  partialize(state: StoreState) {
    return {
      metadata: state.metadata,
      lookupTables: state.lookupTables,
    };
  },
  onRehydrateStorage: () => {
    console.time("[persist] hydration");
    return () => console.timeEnd("[persist] hydration");
  },
};
