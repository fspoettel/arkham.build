import type {
  AllCardResponse,
  DataVersionResponse,
  MetadataResponse,
} from "@/store/services/queries";

import type { Id } from "./data.types";

export type SharedSlice = {
  init(
    queryMetadata: () => Promise<MetadataResponse>,
    queryDataVersion: () => Promise<DataVersionResponse>,
    queryCards: () => Promise<AllCardResponse>,
    refresh?: boolean,
  ): Promise<boolean>;

  createDeck(): string | number;

  saveDeck(deckId: Id): void;
  deleteDeck(id: Id): void;
};
