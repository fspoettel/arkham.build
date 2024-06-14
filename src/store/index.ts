import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { StoreState } from "./slices";
import { createFiltersSlice } from "./slices/filters";
import { createLookupTablesSlice } from "./slices/lookup-tables";
import { createMetadataSlice } from "./slices/metadata";
import { createSearchSlice } from "./slices/search";
import { createSettingsSlice } from "./slices/settings";
import { createSharedSlice } from "./slices/shared";
import { createUISlice } from "./slices/ui";
import { storageConfig } from "./storage";

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...createMetadataSlice(...args),
        ...createLookupTablesSlice(...args),
        ...createFiltersSlice(...args),
        ...createSettingsSlice(...args),
        ...createSearchSlice(...args),
        ...createUISlice(...args),
        ...createSharedSlice(...args),
      }),
      storageConfig,
    ),
  ),
);
