import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { DeckDisplay } from "@/components/deck-display/deck-display";
import { Loader } from "@/components/ui/loader";
import { useStore } from "@/store";
import { resolveDeck } from "@/store/lib/resolve-deck";
import { selectDeckValid } from "@/store/selectors/deck-view";
import { getShare } from "@/store/services/queries";
import { useQuery } from "@/utils/use-query";
import { ResolvedDeckProvider } from "@/utils/use-resolved-deck";
import { useCallback } from "react";
import { useParams } from "wouter";
import { Error404 } from "../errors/404";

function Share() {
  const { id } = useParams<{ id: string }>();

  const query = useCallback(() => getShare(id), [id]);

  const { data, loading, error } = useQuery(query);

  const resolvedDeck = useStore((state) => {
    if (!data) return undefined;
    return resolveDeck(state.metadata, state.lookupTables, data);
  });

  const validation = useStore((state) => {
    return selectDeckValid(state, resolvedDeck);
  });

  if (loading) return <Loader />;
  if (error) return <Error404 />;

  if (!resolvedDeck) return null;

  return (
    <ResolvedDeckProvider resolvedDeck={resolvedDeck}>
      <CardModalProvider>
        <DeckDisplay
          deck={resolvedDeck}
          owned={false}
          validation={validation}
        />
      </CardModalProvider>
    </ResolvedDeckProvider>
  );
}

export default Share;
