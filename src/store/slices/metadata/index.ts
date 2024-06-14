import { StateCreator } from "zustand";
import { StoreState } from "..";
import { mappedByCode } from "./utils";
import { MetadataSlice } from "./types";
import { rewriteImageUrl } from "@/utils/image-urls";

export const createMetadataSlice: StateCreator<
  StoreState,
  [],
  [],
  MetadataSlice
> = (set) => ({
  metadata: {
    dataVersion: undefined,
    cards: {},
    cycles: {},
    encounterSets: {},
    packs: {},
    factions: {},
    subtypes: {},
    types: {},
  },
  setMetadata(dataVersion, metadata, cards) {
    set({
      metadata: {
        dataVersion: dataVersion,
        encounterSets: mappedByCode(metadata.card_encounter_set),
        cycles: mappedByCode(metadata.cycle),
        packs: mappedByCode(metadata.pack),
        cards: mappedByCode(cards, (card) => {
          card.imageurl = rewriteImageUrl(card.imageurl);
          card.backimageurl = rewriteImageUrl(card.backimageurl);
        }),
        factions: mappedByCode(metadata.faction),
        subtypes: mappedByCode(metadata.subtype),
        types: mappedByCode(metadata.type),
      },
    });
  },
});
