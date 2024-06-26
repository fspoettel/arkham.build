import type {
  Card,
  Cycle,
  DataVersion,
  EncounterSet,
  Faction,
  Pack,
  SubType,
  Taboo,
  TabooSet,
  Type,
} from "@/store/services/queries.types";

export type Metadata = {
  cards: Record<string, Card>;
  dataVersion?: DataVersion;
  encounterSets: Record<string, EncounterSet>;
  cycles: Record<string, Cycle>;
  factions: Record<string, Faction>;
  packs: Record<string, Pack>;
  subtypes: Record<string, SubType>;
  types: Record<string, Type>;
  tabooSets: Record<string, TabooSet>;
  taboos: Record<string, Taboo>;
};

export type MetadataSlice = {
  metadata: Metadata;
};
