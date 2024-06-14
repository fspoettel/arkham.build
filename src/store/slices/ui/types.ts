import type { StateSnapshot } from "react-virtuoso";

export type UIState = {
  ui: {
    listScrollRestore?: StateSnapshot;
    hydrated: boolean;
    initialized: boolean;
    searchOpen: boolean;
    sidebarOpen: boolean;
  };
};

export type UISlice = UIState & {
  setListScrollRestore(snapshot: StateSnapshot): void;
  setHydrated(): void;
  toggleSearch(): void;
  toggleSidebar(val?: boolean): void;
};
