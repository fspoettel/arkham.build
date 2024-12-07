import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { RemotingSlice, RemotingState } from "./remoting.types";

function getRemotingState(): RemotingState {
  return {
    arkhamdb: false,
    sync: false,
  };
}

export const createRemotingSlice: StateCreator<
  StoreState,
  [],
  [],
  RemotingSlice
> = (set, get) => ({
  remoting: getRemotingState(),

  setRemoting(name, value) {
    const state = get();

    set({
      remoting: {
        ...state.remoting,
        [name]: value,
      },
    });
  },
});
