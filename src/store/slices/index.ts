import { MetadataSlice } from "./metadata/types";
import { FiltersSlice } from "./filters/types";
import { IndexesSlice } from "./indexes/types";
import { SharedSlice } from "./shared/types";

export type StoreState = SharedSlice &
  MetadataSlice &
  IndexesSlice &
  FiltersSlice;
