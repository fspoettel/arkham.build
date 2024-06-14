import { MetadataResponse } from "@/store/graphql/queries";
import {
  Card,
  Cycle,
  DataVersion,
  EncounterSet,
  Faction,
  Pack,
  SubType,
  Type,
} from "@/store/graphql/types";

export type MetadataSlice = {
  metadata: {
    cards: Record<string, Card>;
    dataVersion?: DataVersion;
    encounterSets: Record<string, EncounterSet>;
    cycles: Record<string, Cycle>;
    factions: Record<string, Faction>;
    packs: Record<string, Pack>;
    subtypes: Record<string, SubType>;
    types: Record<string, Type>;
  };
  // Actions
  setMetadata(
    dataVersion: DataVersion,
    metadata: MetadataResponse,
    cards: Card[],
  ): void;
};
