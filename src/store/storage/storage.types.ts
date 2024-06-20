import type { DataState } from "../slices/data.types";
import type { EditsState } from "../slices/deck-edits.types";
import type { Metadata } from "../slices/metadata.types";
import type { SettingsState } from "../slices/settings.types";

type MetadataVal = {
  metadata: Metadata;
};

type AppdataVal = {
  data: DataState;
  deckEdits: EditsState;
  settings: SettingsState;
};

export type Val = MetadataVal & AppdataVal;
