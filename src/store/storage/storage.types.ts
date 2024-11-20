import type { AppState } from "../slices/app.types";
import type { ConnectionsState } from "../slices/connections.types";
import type { DataState } from "../slices/data.types";
import type { EditsState } from "../slices/deck-edits.types";
import type { Metadata } from "../slices/metadata.types";
import type { SettingsState } from "../slices/settings.types";
import type { SharingState } from "../slices/sharing.types";

type MetadataVal = {
  metadata: Metadata;
};

type AppdataVal = {
  app: AppState;
  data: DataState;
  deckEdits: EditsState;
  settings: SettingsState;
  connections: ConnectionsState;
  sharing: SharingState;
};

export type Val = MetadataVal & AppdataVal;
