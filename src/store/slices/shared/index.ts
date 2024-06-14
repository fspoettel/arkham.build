import { StateCreator } from "zustand";
import { Card } from "@/store/graphql/types";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/graphql/queries";
import { rewriteImageUrl } from "@/utils/card-utils";
import { SharedSlice } from "./types";
import { StoreState } from "..";
import { Metadata } from "../metadata/types";
import { getInitialMetadata } from "../metadata";
import { mappedByCode } from "../metadata/utils";
import {
  addCardToLookupTables,
  getInitialLookupTables,
} from "../lookup-tables";

export const createSharedSlice: StateCreator<
  StoreState,
  [],
  [],
  SharedSlice
> = (set) => ({
  async init() {
    console.time("query_data");
    const [metadataResponse, dataVersionResponse, cards] = await Promise.all([
      queryMetadata(),
      queryDataVersion(),
      queryCards(),
    ]);
    console.timeEnd("query_data");

    console.time("create_store_data");
    const lookupTables = getInitialLookupTables();

    const metadata: Metadata = {
      ...getInitialMetadata(),
      dataVersion: dataVersionResponse,
      cards: {},
      cycles: mappedByCode(metadataResponse.cycle),
      packs: mappedByCode(metadataResponse.pack),
      encounterSets: mappedByCode(metadataResponse.card_encounter_set),
      factions: mappedByCode(metadataResponse.faction),
      subtypes: mappedByCode(metadataResponse.subtype),
      types: mappedByCode(metadataResponse.type),
    };

    cards.forEach((c, i) => {
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

    Object.keys(metadata.encounterSets).forEach((code) => {
      if (!metadata.encounterSets[code].pack_code) {
        delete metadata.encounterSets[code];
      }
    });

    set({
      metadata,
      lookupTables,
    });
    console.timeEnd("create_store_data");
  },
});
