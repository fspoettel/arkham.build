import { StateCreator } from "zustand";

import { StoreState } from "..";
import { SettingsSlice, SettingsState } from "./types";

export function getInitialState(): SettingsState {
  return {
    settings: {
      tabooSetId: undefined,
    },
  };
}

export const createSettingsSlice: StateCreator<
  StoreState,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  ...getInitialState(),
});
