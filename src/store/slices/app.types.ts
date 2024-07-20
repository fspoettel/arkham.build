import type {
  AllCardResponse,
  DataVersionResponse,
  MetadataResponse,
} from "@/store/services/queries";

import type { ToastContext } from "@/components/ui/toast";
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

  saveDeck(deckId: Id, toast: ToastContext): Promise<Id>;

  deleteDeck(id: Id, toast: ToastContext): Promise<void>;
  deleteAllDecks(toastCtx: ToastContext): Promise<void>;
};