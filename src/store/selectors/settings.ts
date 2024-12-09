import { createSelector } from "reselect";
import { getInitialSettings } from "../slices/settings";
import type { SettingsState } from "../slices/settings.types";

export const selectSettings = createSelector(
  (state) => state.settings,
  (settings) =>
    ({
      ...getInitialSettings(),
      ...settings,
    }) as SettingsState,
);
