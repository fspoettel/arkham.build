import type { AppSlice } from "./app.types";
import type { DataSlice } from "./data.types";
import type { DeckCreateSlice } from "./deck-create.types";
import type { DeckEditsSlice } from "./deck-edits.types";
import type { ListsSlice } from "./lists.types";
import type { LookupTablesSlice } from "./lookup-tables.types";
import type { MetadataSlice } from "./metadata.types";
import type { SettingsSlice } from "./settings.types";
import type { SharingSlice } from "./sharing.types";
import type { UISlice } from "./ui.types";

export type StoreState = AppSlice &
  MetadataSlice &
  ListsSlice &
  LookupTablesSlice &
  UISlice &
  SettingsSlice &
  DataSlice &
  DeckEditsSlice &
  DeckCreateSlice &
  SharingSlice;
