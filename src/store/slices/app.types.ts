import type {
  AllCardResponse,
  DataVersionResponse,
  MetadataResponse,
} from "@/store/services/queries";

import type { ToastContextType } from "@/components/ui/toast.hooks";
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

  saveDeck(deckId: Id, toast: ToastContextType): Promise<Id>;

  deleteUpgrade(id: Id): Id;
  upgradeDeck(id: Id, xp: number, exileString: string): Id;

  deleteDeck(id: Id, toast: ToastContextType): Promise<void>;
  deleteAllDecks(toastCtx: ToastContextType): Promise<void>;
};
