import type { DataSlice } from "./data/types";
import type { DeckViewSlice } from "./deck-view/types";
import type { FiltersSlice } from "./filters/types";
import type { LookupTablesSlice } from "./lookup-tables/types";
import type { MetadataSlice } from "./metadata/types";
import type { SearchSlice } from "./search/types";
import type { SettingsSlice } from "./settings/types";
import type { SharedSlice } from "./shared/types";
import type { UISlice } from "./ui/types";

export type StoreState = SharedSlice &
  MetadataSlice &
  LookupTablesSlice &
  UISlice &
  SearchSlice &
  SettingsSlice &
  DataSlice &
  DeckViewSlice &
  FiltersSlice;
