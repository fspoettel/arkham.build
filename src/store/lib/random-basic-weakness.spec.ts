import { getMockStore } from "@/test/get-mock-store";
import { beforeAll, describe, expect, it } from "vitest";
import { StoreApi } from "zustand";
import { StoreState } from "../slices";
import { Deck } from "../slices/data.types";
import { randomBasicWeaknessForDeck } from "./random-basic-weakness";

describe("randomBasicWeaknessForDeck", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();

    const state = store.getState();

    let mockState: Partial<StoreState> = {
      deckEdits: {},
      data: {
        decks: {
          foo: {
            id: "foo",
            investigator_code: "02003",
            slots: {},
          } as Deck,
        },
        history: {
          foo: [],
        },
      },
    };

    store.setState(mockState);
  });

  it("draws a basic weakness", () => {
    const weakness = randomBasicWeaknessForDeck(store.getState(), "foo");
    expect(weakness).toBeDefined();
  });

  it("respects collection setting when drawing", () => {
    store.setState({
      settings: {
        collection: {
          eoep: 1,
        },
        lists: {} as any,
        showAllCards: false,
        hideWeaknessesByDefault: false,
        tabooSetId: undefined,
      },
    });

    store.setState({
      data: {
        decks: {
          foo: {
            id: "foo",
            investigator_code: "02003",
            slots: {
              "08130": 1,
              "08132": 1,
              "08133": 1,
            },
          } as unknown as Deck,
        },
        history: {
          foo: [],
        },
      },
    });

    expect(randomBasicWeaknessForDeck(store.getState(), "foo")).toEqual(
      "08131",
    );
  });

  it("respects investigator faction when drawing", () => {
    store.setState({
      settings: {
        collection: {
          tskp: 1,
        },
        lists: {} as any,
        showAllCards: false,
        hideWeaknessesByDefault: false,
        tabooSetId: undefined,
      },
    });

    store.setState({
      data: {
        decks: {
          foo: {
            id: "foo",
            investigator_code: "02003",
            slots: {
              "09126": 1,
            },
          } as unknown as Deck,
        },
        history: {
          foo: [],
        },
      },
    });

    expect(randomBasicWeaknessForDeck(store.getState(), "foo")).toBeUndefined();
  });
});
