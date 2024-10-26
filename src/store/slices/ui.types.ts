export type UIState = {
  ui: {
    hydrated: boolean;
    initialized: boolean;
    showUnusableCards: boolean;
    sidebarOpen: boolean;
    filtersOpen: boolean;
    usingDeckTools: boolean;
  };
};

export type UISlice = UIState & {
  setHydrated(): void;
  setShowUnusableCards(value: boolean): void;
  setSidebarOpen(set: boolean): void;
  setFiltersOpen(set: boolean): void;
  setUsingDeckTools(set: boolean): void;
};
