export type UIState = {
  ui: {
    hydrated: boolean;
    initialized: boolean;
    filtersOpen: boolean;
    sidebarOpen: boolean;
  };
};

export type UISlice = UIState & {
  setHydrated(): void;
  toggleFilters(val: boolean): void;
  toggleSidebar(val: boolean): void;
};
