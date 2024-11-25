import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import {
  DeckDisplay,
  type DeckDisplayProps,
} from "@/components/deck-display/deck-display";
import { Loader } from "@/components/ui/loader";
import { useStore } from "@/store";
import { resolveDeck } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import {
  getDeckHistory,
  selectDeckHistory,
  selectDeckValid,
  selectResolvedDeckById,
} from "@/store/selectors/decks";
import { selectClientId } from "@/store/selectors/shared";
import { queryDeck } from "@/store/services/queries";
import { useQuery } from "@/utils/use-query";
import { ResolvedDeckProvider } from "@/utils/use-resolved-deck";
import { useEffect, useMemo } from "react";
import { useParams } from "wouter";
import { Error404 } from "../errors/404";

function DeckView() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    document.documentElement.classList.add("scrollbar-stable");
    return () => {
      document.documentElement.classList.remove("scrollbar-stable");
    };
  }, []);

  const resolvedDeck = useStore((state) => selectResolvedDeckById(state, id));

  return resolvedDeck ? (
    <LocalDeckView deck={resolvedDeck} />
  ) : (
    <ArkhamDbDeckView id={id} />
  );
}

function ArkhamDbDeckView({ id }: { id: string }) {
  const clientId = useStore(selectClientId);

  const idInt = Number.parseInt(id, 10);

  const query = useMemo(() => {
    const queryType = window.location.href.includes("/decklist/view")
      ? "decklist"
      : "deck";

    return Number.isFinite(idInt)
      ? () => queryDeck(clientId, queryType, idInt)
      : undefined;
  }, [clientId, idInt]);

  const { data, state } = useQuery(query);

  const metadata = useStore((state) => state.metadata);
  const lookupTables = useStore((state) => state.lookupTables);
  const sharing = useStore((state) => state.sharing);

  if (Number.isNaN(idInt)) {
    return <Error404 />;
  }

  if (state === "loading" || state === "initial") {
    return <Loader show message="Fetching deck..." />;
  }

  if (state === "error") {
    return <Error404 />;
  }

  const decks = data.map((deck) =>
    resolveDeck(metadata, lookupTables, sharing, deck),
  );

  return (
    <DeckViewInner
      context="arkhamdb"
      deck={decks[0]}
      history={getDeckHistory(decks.toReversed(), metadata)}
    />
  );
}

function LocalDeckView({ deck }: { deck: ResolvedDeck }) {
  const history = useStore((state) => selectDeckHistory(state, deck.id));
  return <DeckViewInner context="local" deck={deck} history={history} />;
}

function DeckViewInner({
  context,
  deck,
  history,
}: Omit<DeckDisplayProps, "validation">) {
  const validation = useStore((state) => selectDeckValid(state, deck));

  return (
    <ResolvedDeckProvider resolvedDeck={deck}>
      <CardModalProvider>
        <DeckDisplay
          context={context}
          deck={deck}
          history={history}
          validation={validation}
        />
      </CardModalProvider>
    </ResolvedDeckProvider>
  );
}

export default DeckView;
