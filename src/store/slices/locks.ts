import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { LocksSlice, LocksState } from "./locks.types";

function getLocksState(): LocksState {
  return {
    arkhamdb: false,
    sync: false,
  };
}

export const createLocksSlice: StateCreator<StoreState, [], [], LocksSlice> = (
  set,
  get,
) => ({
  locks: getLocksState(),

  setLock(name, value) {
    const state = get();

    set({
      locks: {
        ...state.locks,
        [name]: value,
      },
    });
  },
});
