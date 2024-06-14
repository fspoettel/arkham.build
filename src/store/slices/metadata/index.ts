import { StateCreator } from "zustand";

import { StoreState } from "..";
import { Metadata, MetadataSlice } from "./types";

export function getInitialMetadata(): Metadata {
  return {
    dataVersion: undefined,
    cards: {},
    cycles: {},
    encounterSets: {},
    packs: {},
    factions: {},
    subtypes: {},
    types: {},
  };
}

export const createMetadataSlice: StateCreator<
  StoreState,
  [],
  [],
  MetadataSlice
> = () => ({
  metadata: getInitialMetadata(),
});
