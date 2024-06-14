import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { StoreState } from "./slices";
import { createDataSlice } from "./slices/data";
import { createdeckCreateSlice } from "./slices/deck-create";
import { createDeckViewSlice } from "./slices/deck-view";
import { createListsSlice } from "./slices/lists";
import { createLookupTablesSlice } from "./slices/lookup-tables";
import { createMetadataSlice } from "./slices/metadata";
import { createSettingsSlice } from "./slices/settings";
import { createSharedSlice } from "./slices/shared";
import { createUISlice } from "./slices/ui";
import { storageConfig } from "./storage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stateCreator = (...args: [any, any, any]) => ({
  ...createDataSlice(...args),
  ...createMetadataSlice(...args),
  ...createLookupTablesSlice(...args),
  ...createListsSlice(...args),
  ...createSettingsSlice(...args),
  ...createUISlice(...args),
  ...createSharedSlice(...args),
  ...createDeckViewSlice(...args),
  ...createdeckCreateSlice(...args),
});

export const useStore = create<StoreState>()(
  import.meta.env.MODE === "test"
    ? stateCreator
    : devtools(persist(stateCreator, storageConfig)),
);
