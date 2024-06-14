import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { StoreState } from "./slices";
import { createFiltersSlice } from "./slices/filters";
import { createLookupTablesSlice } from "./slices/lookup-tables";
import { createMetadataSlice } from "./slices/metadata";
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
        ...createUISlice(...args),
        ...createSharedSlice(...args),
      }),
      storageConfig,
    ),
  ),
);
