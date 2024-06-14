import type { StateSnapshot } from "react-virtuoso";

export type UIState = {
  ui: {
    listScrollRestore: StateSnapshot | undefined;
    hydrated: boolean;
    initialized: boolean;
    searchOpen: boolean;
    sidebarOpen: boolean;
    activeDeckId: string | undefined;
  };
};

export type UISlice = UIState & {
  setListScrollRestore(snapshot: StateSnapshot): void;
  setHydrated(): void;
  toggleSearch(): void;
  toggleSidebar(val?: boolean): void;
  setActiveDeckId(id: string | undefined): void;
};
