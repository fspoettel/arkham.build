import { StateCreator } from "zustand";
import { StoreState } from "..";
import { mappedByCode } from "./utils";
import { MetadataSlice } from "./types";

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
    packs: {},
    factions: {},
    subtypes: {},
    types: {},
  },
  setMetadata(dataVersion, metadata, cards) {
    set({
      metadata: {
        dataVersion: dataVersion,
        cycles: mappedByCode(metadata.cycle),
        packs: mappedByCode(metadata.pack),
        cards: mappedByCode(cards),
        factions: mappedByCode(metadata.faction),
        subtypes: mappedByCode(metadata.subtype),
        types: mappedByCode(metadata.type),
      },
    });
  },
});
