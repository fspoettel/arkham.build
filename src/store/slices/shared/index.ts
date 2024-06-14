import { StateCreator } from "zustand";
import { SharedSlice } from "./types";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/graphql/queries";
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

    cards.forEach((card, i) => {
      metadata.cards[card.code] = card;

      if (card.encounter_code) {
        const encounterSet = metadata.encounterSets[card.encounter_code];

        if (encounterSet && !encounterSet.pack_code) {
          encounterSet.pack_code = card.pack_code;
        } else if (
          encounterSet?.pack_code &&
          encounterSet.pack_code !== card.pack_code
        ) {
          console.debug("duplicate encounter set", encounterSet);
        }
      }
      addCardToLookupTables(lookupTables, card, i);
    });

    set({ metadata, lookupTables });
    console.timeEnd("create_store_data");
  },
});
