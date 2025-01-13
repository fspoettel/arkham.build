import { createSelector } from "reselect";
import type { StoreState } from "../slices";
import { getInitialSettings } from "../slices/settings";
import type { SettingsState } from "../slices/settings.types";

export const selectSettings = createSelector(
  (state: StoreState) => state.settings,
  (settings) =>
    ({
      ...getInitialSettings(),
      ...settings,
    }) as SettingsState,
);
