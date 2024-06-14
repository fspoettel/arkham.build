import { Card } from "@/store/graphql/types";

export type Index = Record<string, Record<string, 1>>;

export type IndexesSlice = {
  indexes: Record<string, Index>;
  createIndexes(cards: Card[]): void;
};
