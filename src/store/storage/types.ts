import type { DecksState } from "../slices/decks/types";
import type { Metadata } from "../slices/metadata/types";
import type { SettingsState } from "../slices/settings/types";

type MetadataVal = {
  metadata: Metadata;
};

type AppdataVal = {
  decks: DecksState;
  settings: SettingsState;
};

export type Val = MetadataVal & AppdataVal;
