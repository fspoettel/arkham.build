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
> = (set, _get) => ({
  customData: getInitialCustomData(),

  addCustomProject(project) {
    const { code } = project.meta;

    set((state) => ({
      ...state,
      customData: {
        ...state.customData,
        projects: {
          ...state.customData.projects,
          [code]: project,
        },
      },
    }));
  },

  removeCustomProject() {},
});
