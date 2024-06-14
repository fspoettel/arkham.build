import type { StoreState } from "@/store/slices";
import type { UpgradeDiff } from "@/store/slices/data/types";

function migrate(_state: unknown, version: number) {
  const state = _state as StoreState;

  if (version === 1) {
    state.data.upgrades = {
      ...Object.values(state.data.decks).reduce<{
        [id: string | number]: UpgradeDiff[];
      }>((acc, curr) => {
        acc[curr.id] = [];
        return acc;
      }, {}),
    };
  }
}

export default migrate;
