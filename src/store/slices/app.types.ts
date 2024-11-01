import type {
  AllCardResponse,
  DataVersionResponse,
  MetadataResponse,
} from "@/store/services/queries";
import type { Id } from "./data.types";

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

  createDeck(): string | number;

  saveDeck(deckId: Id): Id;

  deleteUpgrade(id: Id, callback?: (id: Id) => void): Promise<Id>;
  upgradeDeck(payload: {
    id: Id;
    xp: number;
    exileString: string;
    usurped?: boolean;
  }): Id;

  deleteDeck(id: Id, callback?: () => void): Promise<void>;

  deleteAllDecks(): Promise<void>;
};
