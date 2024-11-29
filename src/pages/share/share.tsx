import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { DeckDisplay } from "@/components/deck-display/deck-display";
import { Loader } from "@/components/ui/loader";
import { useStore } from "@/store";
import { resolveDeck } from "@/store/lib/resolve-deck";
import { selectDeckValid } from "@/store/selectors/decks";
import { getShare } from "@/store/services/queries";
import type { StoreState } from "@/store/slices";
import type { Deck } from "@/store/slices/data.types";
import { useQuery } from "@/utils/use-query";
import { ResolvedDeckProvider } from "@/utils/use-resolved-deck";
import { useCallback } from "react";
import { createSelector } from "reselect";
import { useParams } from "wouter";
import { Error404 } from "../errors/404";

const selectResolvedShare = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.sharing,
  (_: StoreState, data: Deck | undefined) => data,
  (metadata, lookupTables, sharing, data) => {
    if (!data) return undefined;
    return resolveDeck(metadata, lookupTables, sharing, data);
  },
);

function Share() {
  const { id } = useParams<{ id: string }>();

  const query = useCallback(() => getShare(id), [id]);

  const { data, state, error } = useQuery(query);

  const resolvedDeck = useStore((state) => selectResolvedShare(state, data));
  const validation = useStore((state) => selectDeckValid(state, resolvedDeck));

  if (state === "initial" || state === "loading") return <Loader />;
  if (error) return <Error404 />;

  if (!resolvedDeck) return null;

  return (
    <ResolvedDeckProvider resolvedDeck={resolvedDeck}>
      <CardModalProvider>
        <DeckDisplay
          origin="share"
          deck={resolvedDeck}
          validation={validation}
        />
      </CardModalProvider>
    </ResolvedDeckProvider>
  );
}

export default Share;
