import type { CustomContentProject } from "../lib/custom-content";

export type CustomDataState = {
  projects: Record<string, CustomContentProject>;
};

export type CustomDataSlice = {
  customData: CustomDataState;
};
