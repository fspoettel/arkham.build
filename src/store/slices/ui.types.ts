export type UIState = {
  ui: {
    hydrated: boolean;
    initialized: boolean;
  };
};

export type UISlice = UIState & {
  setHydrated(): void;
};
