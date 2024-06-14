import { MetadataSlice } from "./metadata/types";
import { FiltersSlice } from "./filters/types";
import { LookupTablesSlice } from "./lookup-tables/types";
import { SharedSlice } from "./shared/types";

export type StoreState = SharedSlice &
  MetadataSlice &
  LookupTablesSlice &
  FiltersSlice;
