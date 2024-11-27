import { createSelector } from "reselect";
import { getInitialSettings } from "../slices/settings";

export const selectSettings = createSelector(
  (state) => state.settings,
  (settings) => ({
    ...getInitialSettings(),
    ...settings,
  }),
);
