import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Card, State, getInitialState } from "./schema";
import { storageConfig } from "./storage";
import { indexedByCode } from "./utils";
import { queryCards, queryDataVersion, queryMetadata } from "./graphql";

type Actions = {
  sync(): Promise<void>;
};

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...getInitialState(),
        async sync() {
          const [metadata, dataVersion, cards] = await Promise.all([
            queryMetadata(),
            queryDataVersion(),
            queryCards(),
          ]);

          set({
            dataVersion,
            cycles: indexedByCode(metadata.cycle),
            packs: indexedByCode(metadata.pack),
            cards: cards.reduce(
              (acc, curr) => {
                const card = curr as Card;
                card.linked_card_code = curr.linked_card?.code;
                acc[card.code] = card;
                return acc;
              },
              {} as Record<string, Card>,
            ),
          });
        },
      }),
      storageConfig,
    ),
  ),
);
