import { StoreState } from "../slices";

export function getInitialOwnershipFilter(state: StoreState) {
  const value = Object.values(state.settings.collection).some((x) => x)
    ? ("owned" as const)
    : ("all" as const);

  return {
    open: false,
    value,
  };
}
