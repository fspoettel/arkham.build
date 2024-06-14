import type { Metadata } from "../slices/metadata/types";
import type { SettingsState } from "../slices/settings/types";

type MetadataVal = {
  metadata: Metadata;
};

type AppdataVal = {
  settings: SettingsState;
};

export type Val = MetadataVal & AppdataVal;
