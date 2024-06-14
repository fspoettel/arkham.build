import type { StateCreator } from "zustand";

import { applyDeckEdits } from "@/store/lib/deck-edits";
import type { Card } from "@/store/services/types";
import { ALT_ART_INVESTIGATOR_MAP } from "@/utils/constants";

import type { StoreState } from ".";
import { mappedByCode, mappedById } from "../../utils/metadata-utils";
import { getInitialFilters } from "./filters";
import { createLookupTables, createRelations } from "./lookup-tables";
import { getInitialMetadata } from "./metadata";
import type { Metadata } from "./metadata.types";
import type { SharedSlice } from "./shared.types";

export const createSharedSlice: StateCreator<
  StoreState,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  async init(queryMetadata, queryDataVersion, queryCards, refresh = false) {
    const state = get();

    if (!refresh && state.metadata.dataVersion?.cards_updated_at) {
      state.refreshLookupTables({ filters: getInitialFilters(state) });
      return false;
    }

    console.time("[perf] query_data");
    const [metadataResponse, dataVersionResponse, cards] = await Promise.all([
      queryMetadata(),
      queryDataVersion(),
      queryCards(),
    ]);
    console.timeEnd("[perf] query_data");

    console.time("[perf] create_store_data");
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
      metadata,
      lookupTables,
      ui: {
        ...state.ui,
        initialized: true,
      },
      filters: getInitialFilters(state),
    });

    console.timeEnd("[perf] create_store_data");

    return true;
  },
  saveDeck() {
    const state = get();

    if (state.deckView?.mode !== "edit") {
      console.warn("Tried to save deck but not in edit mode.");
      return;
    }

    const deck = state.data.decks[state.deckView.id];
    if (!deck) return;

    const nextDeck = applyDeckEdits(deck, state.deckView, state.metadata, true);

    set({
      deckView: {
        ...state.deckView,
        activeTab: state.deckView.activeTab,
        edits: {
          meta: {},
          quantities: {},
          customizations: {},
        },
      },
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [nextDeck.id]: nextDeck,
        },
      },
    });

    return nextDeck.id;
  },
});
