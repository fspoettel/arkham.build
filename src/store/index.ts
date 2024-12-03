import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { StoreState } from "./slices";
import { createAppSlice } from "./slices/app";
import { createConnectionsSlice } from "./slices/connections";
import { createDataSlice } from "./slices/data";
import { createDeckFiltersSlice } from "./slices/deck-collection-filters";
import { createDeckCreateSlice } from "./slices/deck-create";
import { createDeckEditsSlice } from "./slices/deck-edits";
import { createListsSlice } from "./slices/lists";
import { createLocksSlice } from "./slices/locks";
import { createLookupTablesSlice } from "./slices/lookup-tables";
import { createMetadataSlice } from "./slices/metadata";
import { createSettingsSlice } from "./slices/settings";
import { createSharingSlice } from "./slices/sharing";
import { createUISlice } from "./slices/ui";
import { partialize, storageConfig } from "./storage";
import { shared } from "./storage/sync-store-across-tabs";

// biome-ignore lint/suspicious/noExplicitAny: safe.
const stateCreator = (...args: [any, any, any]) => ({
  ...createAppSlice(...args),
  ...createDataSlice(...args),
  ...createMetadataSlice(...args),
  ...createLookupTablesSlice(...args),
  ...createListsSlice(...args),
  ...createSettingsSlice(...args),
  ...createUISlice(...args),
  ...createDeckEditsSlice(...args),
  ...createDeckCreateSlice(...args),
  ...createSharingSlice(...args),
  ...createDeckFiltersSlice(...args),
  ...createConnectionsSlice(...args),
  ...createLocksSlice(...args),
});

export const useStore = create<StoreState>()(
  import.meta.env.MODE === "test"
    ? stateCreator
    : devtools(
        shared(persist(stateCreator, storageConfig), {
          partialize(state) {
            return {
              ...partialize(state),
              locks: state.locks,
            };
          },
          merge(state, receivedState) {
            return { ...state, ...receivedState };
          },
        }),
      ),
);
