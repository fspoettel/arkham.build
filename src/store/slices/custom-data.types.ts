import type { CustomContentProject } from "../lib/custom-content.types";

export type CustomDataState = {
  projects: Record<string, CustomContentProject>;
};

export type CustomDataSlice = {
  customData: CustomDataState;
  addCustomProject: (project: CustomContentProject) => void;
  removeCustomProject: (id: string) => void;
};
