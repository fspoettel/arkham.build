import type { StoreState } from "../slices";
import { migrate } from "./migrate";
import { VERSION, makeStorageAdapter } from "./storage";

type AppState = Pick<
  StoreState,
  "app" | "connections" | "data" | "deckEdits" | "settings" | "sharing"
>;

type MetadataState = Pick<StoreState, "metadata">;

const metadataStorage = makeStorageAdapter<MetadataState>(
  "deckbuilder-metadata",
  (state) => ({
    metadata: state.metadata,
  }),
);

export const appStorage = makeStorageAdapter<AppState>(
  "deckbuilder-app",
  (state) => ({
    app: state.app,
    connections: state.connections,
    data: state.data,
    deckEdits: state.deckEdits,
    settings: state.settings,
    sharing: state.sharing,
  }),
);

export async function hydrate(_state: StoreState) {
  const [metadataState, appState] = await Promise.all([
    metadataStorage.get(),
    appStorage.get(),
  ]);

  if (!metadataState && !appState) {
    return undefined;
  }

  const version = Math.min(
    metadataState?.version ?? VERSION,
    appState?.version ?? VERSION,
  );

  let state: StoreState = {
    ..._state,
    ...metadataState?.state,
    ...appState?.state,
    ui: {
      ..._state.ui,
      hydrated: true,
    },
  };

  if (version !== VERSION) {
    state = migrate(state, version);
    await Promise.all([metadataStorage.set(state), appStorage.set(state)]);
  }

  return state;
}

export function dehydrateMetadata(state: StoreState) {
  return metadataStorage.set(state);
}

export function dehydrateApp(state: StoreState) {
  return appStorage.set(state);
}
