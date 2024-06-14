import { Card } from "@/store/graphql/types";

export type Index<T extends string | number> = Record<string, T>;

export type BinaryIndex = Record<string, Record<string | number, 1>>;

export type Indexes = {
  actions: BinaryIndex;
  cost: BinaryIndex;
  encounter_code: BinaryIndex;
  faction_code: BinaryIndex;
  pack_code: BinaryIndex;
  subtype_code: BinaryIndex;
  type_code: BinaryIndex;
  properties: BinaryIndex;
  skill_icons: BinaryIndex;
  slots: BinaryIndex;
  skill_boosts: BinaryIndex;
  sort: Record<string, Index<number>>;
  traits: BinaryIndex;
  uses: BinaryIndex;
  level: BinaryIndex;
};

export type IndexesSlice = {
  indexes: Indexes;
  createIndexes(cards: Card[]): void;
};
