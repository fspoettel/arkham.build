export type UIState = {
  ui: {
    hydrated: boolean;
    initialized: boolean;
    showUnusableCards: boolean;
  };
};

export type UISlice = UIState & {
  setHydrated(): void;
  setShowUnusableCards(value: boolean): void;
};
