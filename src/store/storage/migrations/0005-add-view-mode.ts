import type { StoreState } from "@/store/slices";

function migrate(_state: unknown, version: number) {
  const state = _state as StoreState;

  if (version < 6) {
    for (const key of Object.keys(state.settings.lists)) {
      // biome-ignore lint/performance/noDelete: safe.
      delete (
        state.settings.lists[
          key as keyof StoreState["settings"]["lists"]
          // biome-ignore lint/suspicious/noExplicitAny: safe.
        ] as any
      ).showCardText;

      state.settings.lists[
        key as keyof StoreState["settings"]["lists"]
      ].viewMode = "compact";
    }
  }

  return state;
}

export default migrate;
