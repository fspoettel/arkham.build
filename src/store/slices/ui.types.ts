export type UIState = {
  ui: {
    initialized: boolean;
    showUnusableCards: boolean;
    showLimitedAccess: boolean;
  };
};

export type UISlice = UIState & {
  setShowUnusableCards(value: boolean): void;
  setShowLimitedAccess(value: boolean): void;
};
