import type { StateCreator } from "zustand";

import { applyDeckEdits } from "@/store/lib/deck-edits";
import { createDeck } from "@/store/lib/deck-factory";
import type { Card } from "@/store/services/queries.types";
import { assert } from "@/utils/assert";
import {
  ALT_ART_INVESTIGATOR_MAP,
  SPECIAL_CARD_CODES,
} from "@/utils/constants";

import { randomId } from "@/utils/crypto";
import { time, timeEnd } from "@/utils/time";
import type { StoreState } from ".";
import { mappedByCode, mappedById } from "../lib/metadata-utils";
import { resolveDeck } from "../lib/resolve-deck";
import { mapValidationToProblem } from "../lib/serialization/deck-io";
import { encodeExtraSlots } from "../lib/serialization/slots";
import type { DeckMeta } from "../lib/types";
import { selectDeckCreateCardSets } from "../selectors/deck-create";
import { selectDeckValid } from "../selectors/deck-view";
import type { AppSlice } from "./app.types";
import { makeLists } from "./lists";
import { createLookupTables, createRelations } from "./lookup-tables";
import { getInitialMetadata } from "./metadata";
import type { Metadata } from "./metadata.types";

export function getInitialAppState() {
  return {
    clientId: "",
  };
}

export const createAppSlice: StateCreator<StoreState, [], [], AppSlice> = (
  set,
  get,
) => ({
  app: getInitialAppState(),

  async init(queryMetadata, queryDataVersion, queryCards, refresh = false) {
    const state = get();

    if (!refresh && state.metadata.dataVersion?.cards_updated_at) {
      state.refreshLookupTables({
        lists: makeLists(state.settings),
      });

      return false;
    }

    time("query_data");
    const [metadataResponse, dataVersionResponse, cards] = await Promise.all([
      queryMetadata(),
      queryDataVersion(),
      queryCards(),
    ]);
    timeEnd("query_data");

    time("create_store_data");
    const metadata: Metadata = {
      ...getInitialMetadata(),
      dataVersion: dataVersionResponse,
      cards: {},
      taboos: {},
      cycles: mappedByCode(metadataResponse.cycle),
      packs: {
        ...mappedByCode(metadataResponse.pack),
        ...mappedByCode(metadataResponse.reprint_pack),
      },
      encounterSets: mappedByCode(metadataResponse.card_encounter_set),
      factions: mappedByCode(metadataResponse.faction),
      subtypes: mappedByCode(metadataResponse.subtype),
      types: mappedByCode(metadataResponse.type),
      tabooSets: mappedById(metadataResponse.taboo_set),
    };

    if (metadata.packs["rcore"]) {
      metadata.packs["rcore"].reprint = {
        type: "rcore",
      };
    }

    for (const c of cards) {
      if (c.taboo_set_id) {
        metadata.taboos[c.id] = {
          code: c.code,
          real_text: c.real_text,
          real_back_text: c.real_back_text,
          real_taboo_text_change: c.real_taboo_text_change,
          taboo_set_id: c.taboo_set_id,
          taboo_xp: c.taboo_xp,
          exceptional: c.exceptional,
          deck_requirements: c.deck_requirements,
          deck_options: c.deck_options,
          customization_options: c.customization_options,
          real_customization_text: c.real_customization_text,
          real_customization_change: c.real_customization_change,
        };

        continue;
      }

      // SAFE! Diverging fields are added below.
      const card = c as Card;

      const pack = metadata.packs[card.pack_code];
      const cycle = metadata.cycles[pack.cycle_code];

      if (card.code in ALT_ART_INVESTIGATOR_MAP) {
        card.duplicate_of_code =
          ALT_ART_INVESTIGATOR_MAP[
            card.code as keyof typeof ALT_ART_INVESTIGATOR_MAP
          ];
      }

      // tempfix: https://github.com/Kamalisk/arkhamdb-json-data/pull/1412
      if (card.code === "04325b" || card.code === "04326b") {
        card.encounter_code = "shattered_aeons";
      }

      // tempfix: "tags" is sometimes empty string, see: https://github.com/Kamalisk/arkhamdb-json-data/pull/1351#issuecomment-1937852236
      if (!card.tags) card.tags = undefined;
      card.parallel = cycle?.code === "parallel";
      card.original_slot = card.real_slot;

      metadata.cards[card.code] = card;

      if (card.encounter_code) {
        const encounterSet = metadata.encounterSets[card.encounter_code];

        if (encounterSet && !encounterSet.pack_code) {
          encounterSet.pack_code = card.pack_code;
        }
      }
    }

    const lookupTables = createLookupTables(metadata, state.settings);
    createRelations(metadata, lookupTables);

    for (const code of Object.keys(metadata.encounterSets)) {
      if (!metadata.encounterSets[code].pack_code) {
        delete metadata.encounterSets[code];
      }
    }

    set({
      app: {
        clientId: state.app.clientId || randomId(),
      },
      metadata,
      lookupTables,
      ui: {
        ...state.ui,
        initialized: true,
      },
      lists: makeLists(state.settings),
    });

    timeEnd("create_store_data");

    return true;
  },
  createDeck() {
    const state = get();
    assert(state.deckCreate, "DeckCreate state must be initialized.");

    const extraSlots: Record<string, number> = {};
    const meta: DeckMeta = {};
    const slots: Record<string, number> = {};

    const { investigatorCode, investigatorFrontCode, investigatorBackCode } =
      state.deckCreate;

    if (investigatorCode !== investigatorFrontCode) {
      meta.alternate_front = investigatorFrontCode;
    }

    if (investigatorCode !== investigatorBackCode) {
      meta.alternate_back = investigatorBackCode;
    }

    const back = state.metadata.cards[investigatorBackCode];

    for (const [key, value] of Object.entries(state.deckCreate.selections)) {
      // EDGE CASE: mandy's taboo removes the deck size select,
      // omit any selection made from deck meta.
      if (
        key === "deck_size_selected" &&
        !back.deck_options?.some((o) => !!o.deck_size_select)
      ) {
        continue;
      }

      meta[key as keyof DeckMeta] = value;
    }

    const cardSets = selectDeckCreateCardSets(state);

    for (const set of cardSets) {
      if (!set.selected) continue;

      for (const { card } of set.cards) {
        const quantity =
          state.deckCreate.extraCardQuantities?.[card.code] ??
          set.quantities?.[card.code];

        if (!quantity) continue;

        if (card.code === SPECIAL_CARD_CODES.VENGEFUL_SHADE) {
          extraSlots[card.code] = quantity;
        } else {
          slots[card.code] = quantity;
        }
      }
    }

    if (Object.keys(extraSlots).length) {
      meta.extra_deck = encodeExtraSlots(extraSlots);
    }

    const deck = createDeck({
      investigator_code: state.deckCreate.investigatorCode,
      name: state.deckCreate.title,
      slots,
      meta: JSON.stringify(meta),
      taboo_id: state.deckCreate.tabooSetId,
    });

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [deck.id]: deck,
        },
        history: {
          ...state.data.history,
          [deck.id]: [],
        },
      },
      deckCreate: undefined,
    });

    return deck.id;
  },
  async deleteDeck(id, toast) {
    const state = get();
    const decks = { ...state.data.decks };

    const deckEdits = { ...state.deckEdits };
    delete deckEdits[id];

    const deck = decks[id];
    assert(deck.next_deck == null, "Cannot delete a deck that has upgrades.");

    delete decks[id];
    const history = { ...state.data.history };

    if (history[id]) {
      for (const prevId of history[id]) {
        delete decks[prevId];
        delete deckEdits[prevId];
      }
    }

    delete history[id];

    set({
      data: { ...state.data, decks, history },
      deckEdits,
    });

    toast.show({
      children: "Deck delete successful.",
      duration: 3000,
      variant: "success",
    });

    if (state.sharing.decks[deck.id]) {
      const toastId = toast.show({
        children: "Deleting share...",
      });

      try {
        await state.deleteShare(deck.id as string);

        toast.dismiss(toastId);

        toast.show({
          children: "Share delete successful.",
          duration: 3000,
          variant: "success",
        });
      } catch (err) {
        toast.dismiss(toastId);

        toast.show({
          children: `Share could not be deleted: ${(err as Error)?.message}.`,
          variant: "error",
        });
      }
    }
  },

  async deleteAllDecks(toast) {
    const state = get();

    const decks = { ...state.data.decks };
    const history = { ...state.data.history };
    const edits = { ...state.deckEdits };

    for (const id of Object.keys(decks)) {
      if (decks[id].source === "local") {
        delete decks[id];
        delete history[id];
        delete edits[id];
      }
    }

    set({
      data: { ...state.data, decks, history },
    });

    if (Object.keys(state.sharing.decks).length) {
      const toastId = toast.show({
        children: "Deleting shares...",
      });

      try {
        await state.deleteAllShares();
        toast.dismiss(toastId);
        toast.show({
          children: "Delete shares successful.",
          duration: 3000,
          variant: "success",
        });
      } catch (err) {
        toast.dismiss(toastId);
        toast.show({
          children: `Shares could not be deleted: ${(err as Error)?.message}.`,
          variant: "error",
        });
      }
    }
  },
  async saveDeck(deckId, toast) {
    const state = get();

    const edits = state.deckEdits[deckId];

    const deck = state.data.decks[deckId];
    if (!deck) return deckId;

    const nextDeck = applyDeckEdits(deck, edits, state.metadata, true);
    nextDeck.date_update = new Date().toISOString();

    const resolved = resolveDeck(state.metadata, state.lookupTables, nextDeck);

    const validation = selectDeckValid(state, resolved);
    nextDeck.problem = mapValidationToProblem(validation);

    const deckEdits = { ...state.deckEdits };
    delete deckEdits[deckId];

    set({
      deckEdits,
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [nextDeck.id]: nextDeck,
        },
      },
    });

    toast.show({
      children: "Deck save successful.",
      duration: 3000,
      variant: "success",
    });

    if (state.sharing.decks[nextDeck.id]) {
      const toastId = toast.show({
        children: "Updating share...",
      });

      try {
        await state.updateShare(deck.id as string);

        toast.dismiss(toastId);

        toast.show({
          children: "Share update successful.",
          duration: 3000,
          variant: "success",
        });
      } catch (err) {
        toast.dismiss(toastId);

        toast.show({
          children: `Share could not be updated: ${(err as Error)?.message}. Try again later on the deck page.`,
          variant: "error",
        });
      }
    }

    return nextDeck.id;
  },
});
