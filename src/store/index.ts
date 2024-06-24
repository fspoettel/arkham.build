import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { StoreState } from "./slices";
import { createDataSlice } from "./slices/data";
import { createDeckCreateSlice } from "./slices/deck-create";
import { createDeckEditsSlice } from "./slices/deck-edits";
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
  ...createDeckEditsSlice(...args),
  ...createDeckCreateSlice(...args),
});

export const useStore = create<StoreState>()(
  import.meta.env.MODE === "test"
    ? stateCreator
    : devtools(persist(stateCreator, storageConfig)),
);
