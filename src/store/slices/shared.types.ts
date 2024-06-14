import type {
  AllCardResponse,
  DataVersionResponse,
  MetadataResponse,
} from "@/store/services/queries";

export type SharedSlice = {
  init(
    queryMetadata: () => Promise<MetadataResponse>,
    queryDataVersion: () => Promise<DataVersionResponse>,
    queryCards: () => Promise<AllCardResponse>,
    refresh?: boolean,
  ): Promise<boolean>;

  createDeck(): string | number;

  saveDeck(): void;
};
