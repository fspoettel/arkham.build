export type UIState = {
  ui: {
    hydrated: boolean;
    initialized: boolean;
    showUnusableCards: boolean;
    sidebarOpen: boolean;
    filtersOpen: boolean;
    deckToolsOpen: boolean;
  };
};

export type UISlice = UIState & {
  setHydrated(): void;
  setShowUnusableCards(value: boolean): void;
  setSidebarOpen(set: boolean): void;
  setFiltersOpen(set: boolean): void;
  setDeckToolsOpen(set: boolean): void;
};
