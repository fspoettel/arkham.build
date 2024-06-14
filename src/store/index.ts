import { create } from "zustand";
import { createMetadataSlice } from "./slices/metadata";
import { createLookupTablesSlice } from "./slices/lookup-tables";
import { createFiltersSlice } from "./slices/filters";
import { createSharedSlice } from "./slices/shared";
import { createUISlice } from "./slices/ui";
import { StoreState } from "./slices";
import { devtools, persist } from "zustand/middleware";
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
