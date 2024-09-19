import type { Deck } from "@/store/slices/data.types";

function migrate(_state: unknown, version: number) {
  const state = _state as {
    data: {
      decks: Record<string, Deck>;
      history: [];
    };
  };

  if (version < 6) {
    if (state.data?.decks) {
      state.data = {
        //@ts-ignore
        deckCollection: {
          filters: [],
          decks: { ...state.data.decks },
        },
        history: { ...state.data.history },
      };
    }
  }
}

export default migrate;
