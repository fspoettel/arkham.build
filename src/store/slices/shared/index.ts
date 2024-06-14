import { StateCreator } from "zustand";

import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/graphql/queries";
import { Card } from "@/store/graphql/types";
import { getDataVersionIdentifier } from "@/store/storage";
import { rewriteImageUrl } from "@/utils/card-utils";

import { StoreState } from "..";
import {
  addCardToLookupTables,
  createRelations,
  getInitialLookupTables,
} from "../lookup-tables";
import { getInitialMetadata } from "../metadata";
import { Metadata } from "../metadata/types";
import { mappedByCode, mappedById } from "../metadata/utils";
import { SharedSlice } from "./types";

export const createSharedSlice: StateCreator<
  StoreState,
  [],
  [],
  SharedSlice
> = (set) => ({
  async init() {
    console.time("[performance] query_data");
    const [metadataResponse, dataVersionResponse, cards] = await Promise.all([
      queryMetadata(),
      queryDataVersion(),
      queryCards(),
    ]);
    console.timeEnd("[performance] query_data");

    console.time("[performance] create_store_data");
    const lookupTables = getInitialLookupTables();

    const metadata: Metadata = {
      ...getInitialMetadata(),
      dataVersion: dataVersionResponse,
      cards: {},
      taboos: {},
      cycles: mappedByCode(metadataResponse.cycle),
      packs: mappedByCode(metadataResponse.pack),
      encounterSets: mappedByCode(metadataResponse.card_encounter_set),
      factions: mappedByCode(metadataResponse.faction),
      subtypes: mappedByCode(metadataResponse.subtype),
      types: mappedByCode(metadataResponse.type),
      tabooSets: mappedById(metadataResponse.taboo_set),
    };

    cards.forEach((c, i) => {
      if (c.taboo_set_id) {
        metadata.taboos[c.id] = {
          code: c.code,
          real_text: c.real_text,
          real_back_text: c.real_back_text,
          taboo_set_id: c.taboo_set_id,
          taboo_xp: c.taboo_xp,
        };

        addCardToLookupTables(lookupTables, c, i);
        return;
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

      addCardToLookupTables(lookupTables, card, i);
    });

    createRelations(metadata, lookupTables);
    lookupTables.dataVersion = getDataVersionIdentifier(dataVersionResponse);

    Object.keys(metadata.encounterSets).forEach((code) => {
      if (!metadata.encounterSets[code].pack_code) {
        delete metadata.encounterSets[code];
      }
    });

    set({
      metadata,
      lookupTables,
    });
    console.timeEnd("[performance] create_store_data");
  },
});
