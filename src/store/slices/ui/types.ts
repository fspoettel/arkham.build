import { StateSnapshot } from "react-virtuoso";

export type UIState = {
  ui: {
    listScrollRestore?: StateSnapshot;
  };
};

export type UISlice = UIState & {
  setListScrollRestore(snapshot: StateSnapshot): void;
};
