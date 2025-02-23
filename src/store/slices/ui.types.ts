export type UIState = {
  ui: {
    hydrated: boolean;
    initialized: boolean;
    showUnusableCards: boolean;
    showLimitedAccess: boolean;
  };
};

export type UISlice = UIState & {
  setHydrated(): void;
  setShowUnusableCards(value: boolean): void;
  setShowLimitedAccess(value: boolean): void;
};
