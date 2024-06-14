import type { StateCreator } from "zustand";

import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/services/queries";
import type { Card } from "@/store/services/types";
import { rewriteImageUrl } from "@/utils/card-utils";

import type { StoreState } from "..";
import { getInitialFilters } from "../filters";
import { createLookupTables, createRelations } from "../lookup-tables";
import { getInitialMetadata } from "../metadata";
import type { Metadata } from "../metadata/types";
import { mappedByCode, mappedById } from "../metadata/utils";
import type { SharedSlice } from "./types";

export const createSharedSlice: StateCreator<
  StoreState,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  async init(refresh: boolean = false) {
    const state = get();

    if (!refresh && state.metadata.dataVersion?.cards_updated_at) {
      state.refreshLookupTables({ filters: getInitialFilters(state) });
      return false;
    }

    console.time("[performance] query_data");
    const [metadataResponse, dataVersionResponse, cards] = await Promise.all([
      queryMetadata(),
      queryDataVersion(),
      queryCards(),
    ]);
    console.timeEnd("[performance] query_data");

    console.time("[performance] create_store_data");
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
          customization_options: c.customization_options,
          real_customization_text: c.real_customization_text,
          real_customization_change: c.real_customization_change,
        };

        continue;
      }

      // SAFE! Diverging fields are added below.
      const card = c as Card;

      card.backimageurl = rewriteImageUrl(card.backimageurl);
      card.imageurl = rewriteImageUrl(card.imageurl);

      const pack = metadata.packs[card.pack_code];
      const cycle = metadata.cycles[pack.cycle_code];
      card.parallel = cycle?.code === "parallel";

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

    console.timeEnd("[performance] create_store_data");

    return true;
  },
});
