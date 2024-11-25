import type {
  AllCardResponse,
  DataVersionResponse,
  MetadataResponse,
} from "@/store/services/queries";
import type { Deck, Id } from "./data.types";

export type AppState = {
  clientId: string;
};

export type AppSlice = {
  app: AppState;

  init(
    queryMetadata: () => Promise<MetadataResponse>,
    queryDataVersion: () => Promise<DataVersionResponse>,
    queryCards: () => Promise<AllCardResponse>,
    refresh?: boolean,
  ): Promise<boolean>;

  createDeck(): Promise<Id>;

  saveDeck(deckId: Id): Promise<Id>;

  upgradeDeck(payload: {
    id: Id;
    xp: number;
    exileString: string;
    usurped?: boolean;
  }): Promise<Deck>;

  deleteDeck(id: Id, callback?: () => void): Promise<void>;
  deleteAllDecks(): Promise<void>;
  deleteUpgrade(id: Id, callback?: (id: Id) => void): Promise<Id>;

  backup(): void;
  restore(file: File): Promise<void>;
};
