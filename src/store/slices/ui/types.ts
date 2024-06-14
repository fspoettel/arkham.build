import { StateSnapshot } from "react-virtuoso";

export type UIState = {
  ui: {
    listScrollRestore?: StateSnapshot;
    initialized?: boolean;
  };
};

export type UISlice = UIState & {
  setListScrollRestore(snapshot: StateSnapshot): void;
  setInitialized(): void;
};
