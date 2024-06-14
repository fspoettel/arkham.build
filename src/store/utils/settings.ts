import type { StoreState } from "../slices";

export function getInitialOwnershipFilter(state: StoreState) {
  if (state.settings.showAllCards) {
    return {
      open: false,
      value: "all" as const,
    };
  }

  const value = Object.values(state.settings.collection).some((x) => x)
    ? ("owned" as const)
    : ("all" as const);

  return {
    open: false,
    value,
  };
}
