import type { StateSnapshot } from "react-virtuoso";

export type UIState = {
  ui: {
    listScrollRestore: StateSnapshot | undefined;
    hydrated: boolean;
    initialized: boolean;
    filtersOpen: boolean;
    sidebarOpen: boolean;
  };
};

export type UISlice = UIState & {
  setListScrollRestore(snapshot: StateSnapshot): void;
  setHydrated(): void;
  toggleFilters(val?: boolean): void;
  toggleSidebar(val?: boolean): void;
};
