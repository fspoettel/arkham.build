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

export type Metadata = {
  cards: Record<string, Card>;
  dataVersion?: DataVersion;
  encounterSets: Record<string, EncounterSet>;
  cycles: Record<string, Cycle>;
  factions: Record<string, Faction>;
  packs: Record<string, Pack>;
  subtypes: Record<string, SubType>;
  types: Record<string, Type>;
};

export type MetadataSlice = {
  metadata: Metadata;
};
