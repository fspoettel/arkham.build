import { createSelector } from "reselect";
import type { StoreState } from "../slices";

const AVAILABLE_CONNECTIONS = ["arkhamdb"] as const;

export function selectAvailableConnections() {
  return AVAILABLE_CONNECTIONS;
}

export const selectConnections = createSelector(
  (state: StoreState) => state.connections,
  (connections) => Object.values(connections.data),
);

export const selectSyncHealthy = createSelector(
  selectConnections,
  (connections) => connections.every((c) => c.status === "connected"),
);
