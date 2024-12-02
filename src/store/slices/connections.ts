import type { StateCreator } from "zustand";

import { assertCanPublishDeck } from "@/utils/arkhamdb";
import { assert } from "@/utils/assert";
import type { StoreState } from ".";
import { resolveDeck } from "../lib/resolve-deck";
import { disconnectProviderIfUnauthorized, syncAdapters } from "../lib/sync";
import { ApiError, getDecks, newDeck, updateDeck } from "../services/queries";
import type {
  ConnectionsSlice,
  Provider,
  SyncSuccessState,
} from "./connections.types";
import type { Id } from "./data.types";

export function getInitialConnectionsState() {
  return {
    data: {},
  };
}

export const createConnectionsSlice: StateCreator<
  StoreState,
  [],
  [],
  ConnectionsSlice
> = (set, get) => ({
  connections: getInitialConnectionsState(),

  createConnection(provider, user) {
    set((state) => ({
      connections: {
        ...state.connections,
        data: {
          ...state.connections.data,
          [provider]: {
            createdAt: new Date().valueOf(),
            status: "connected",
            user,
            provider,
          },
        },
      },
    }));
  },
  removeConnection(provider) {
    set((state) => {
      const patch = {
        connections: structuredClone(state.connections),
        data: structuredClone(state.data),
      };

      delete patch.connections.data[provider];

      for (const deckId of Object.keys(state.data.decks)) {
        const deck = state.data.decks[deckId];
        if (deck.source === provider) {
          delete patch.data.decks[deckId];
          delete patch.data.history[deckId];
        }
      }

      return patch;
    });
  },
  async sync() {
    const state = get();

    assert(
      state.ui.syncing === false,
      "Cannot sync while another sync is in progress.",
    );

    set((curr) => ({
      ui: {
        ...curr.ui,
        syncing: true,
      },
    }));

    try {
      for (const provider of Object.keys(state.connections.data)) {
        await state.syncProvider(provider as Provider);
      }
    } finally {
      set((curr) => ({
        ui: {
          ...curr.ui,
          syncing: false,
        },
      }));
    }
  },
  async syncProvider(provider) {
    const state = get();

    const adapater = new syncAdapters[provider](state);

    const connection = state.connections.data[provider];
    assert(connection, `Connection for ${provider} was not found.`);

    try {
      const res = await getDecks(
        (connection.syncDetails as SyncSuccessState)?.lastModified,
      );

      if (res) {
        const { data: apiDecks, lastModified } = res;

        set((curr) => {
          const data = { ...curr.data };

          const apiDeckIds = new Set(apiDecks.map((deck) => deck.id));

          for (const deck of Object.values(state.data.decks)) {
            if (deck.source === provider && !apiDeckIds.has(deck.id)) {
              delete data.decks[deck.id];
            }
          }

          for (const deck of apiDecks) {
            data.decks[deck.id] = adapater.in(deck);
          }

          const history = Object.values(data.decks)
            .filter((deck) => !deck.next_deck)
            .reduce(
              (acc, deck) => {
                acc[deck.id] = [];
                if (!deck.previous_deck) return acc;

                let current = deck;
                const history = [];

                while (
                  current.previous_deck &&
                  data.decks[current.previous_deck]
                ) {
                  current = data.decks[current.previous_deck];
                  history.push(current.id);
                }

                acc[deck.id] = history;
                return acc;
              },
              {} as Record<Id, Id[]>,
            );

          data.history = history;

          const user = apiDecks.length
            ? {
                id: apiDecks[0].user_id ?? undefined,
              }
            : curr.connections.data[provider]?.user;

          return {
            data,
            connections: {
              lastSyncedAt: Date.now(),
              data: {
                ...curr.connections.data,
                [provider]: {
                  ...curr.connections.data[provider],
                  status: "connected",
                  user,
                  syncDetails: {
                    status: "success",
                    errors: [],
                    lastModified,
                    itemsSynced: apiDecks.length,
                    itemsTotal: apiDecks.length,
                  },
                },
              },
            },
          };
        });
      } else {
        set((curr) => ({
          connections: {
            ...curr.connections,
            lastSyncedAt: Date.now(),
          },
        }));
      }
    } catch (err) {
      set((curr) => ({
        connections: {
          lastSyncedAt: Date.now(),
          data: {
            ...curr.connections.data,
            [provider]: {
              ...curr.connections.data[provider],
              status:
                err instanceof ApiError && err.status === 401
                  ? "disconnected"
                  : "connected",
              syncDetails: {
                status: "error",
                errors: [(err as Error)?.message ?? "Unknown error"],
              },
            },
          },
        },
      }));
    }
  },
  async uploadDeck(id, provider) {
    const state = get();

    const deck = structuredClone(state.data.decks[id]);
    assert(deck, `Deck with id ${id} was not found.`);

    const resolved = resolveDeck(
      state.metadata,
      state.lookupTables,
      state.sharing,
      deck,
    );

    assertCanPublishDeck(resolved);

    const connection = state.connections.data[provider];
    assert(connection, `Connection for ${provider} was not found.`);

    const adapter = new syncAdapters[provider](state);

    assert(
      !deck.previous_deck || !deck.next_deck,
      `Deck ${deck.next_deck ? "has" : "is"} an upgrade. Please 'Duplicate' the deck in order to upload it`,
    );

    try {
      const { id } = await newDeck(deck);
      const nextDeck = adapter.in(
        await updateDeck(adapter.out({ ...deck, id })),
      );

      set((curr) => ({
        data: {
          ...curr.data,
          decks: {
            ...curr.data.decks,
            [nextDeck.id]: nextDeck,
          },
          history: {
            ...curr.data.history,
            [nextDeck.id]: [],
          },
        },
      }));

      await state.deleteDeck(deck.id);

      return nextDeck.id;
    } catch (err) {
      disconnectProviderIfUnauthorized("arkhamdb", err, set);
      throw err;
    }
  },
});
