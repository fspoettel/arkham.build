import { StateSnapshot } from "react-virtuoso";

export type UIState = {
  ui: {
    listScrollRestore?: StateSnapshot;
    hydrated?: boolean;
    initialized?: boolean;
  };
};

export type UISlice = UIState & {
  setListScrollRestore(snapshot: StateSnapshot): void;
  setHydrated(): void;
};
