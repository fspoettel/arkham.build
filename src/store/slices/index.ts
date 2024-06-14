import { FiltersSlice } from "./filters/types";
import { LookupTablesSlice } from "./lookup-tables/types";
import { MetadataSlice } from "./metadata/types";
import { SearchSlice } from "./search/types";
import { SettingsSlice } from "./settings/types";
import { SharedSlice } from "./shared/types";
import { UISlice } from "./ui/types";

export type StoreState = SharedSlice &
  MetadataSlice &
  LookupTablesSlice &
  UISlice &
  SearchSlice &
  SettingsSlice &
  FiltersSlice;
