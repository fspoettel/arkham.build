import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { CustomDataSlice, CustomDataState } from "./custom-data.types";

function getInitialCustomData(): CustomDataState {
  return {
    projects: {},
  };
}

export const createCustomDataSlice: StateCreator<
  StoreState,
  [],
  [],
  CustomDataSlice
> = (set, get) => ({
  customData: getInitialCustomData(),
});
