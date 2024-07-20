import { useParams } from "wouter";

import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { useStore } from "@/store";
import {
  selectDeckValid,
  selectResolvedDeckById,
} from "@/store/selectors/deck-view";

import { DeckDisplay } from "@/components/deck-display/deck-display";
import type { ResolvedDeck } from "@/store/lib/types";
import { ResolvedDeckProvider } from "@/utils/use-resolved-deck";
import { Error404 } from "../errors/404";

function DeckView() {
  const { id } = useParams<{ id: string }>();
  const resolvedDeck = useStore((state) => selectResolvedDeckById(state, id));

  if (!resolvedDeck) {
    return <Error404 />;
  }

  return (
    <ResolvedDeckProvider resolvedDeck={resolvedDeck}>
      <CardModalProvider>
        <DeckViewInner deck={resolvedDeck} />
      </CardModalProvider>
    </ResolvedDeckProvider>
  );
}

function DeckViewInner({ deck }: { deck: ResolvedDeck }) {
  const validation = useStore((state) => selectDeckValid(state, deck));
  console.log(validation);

  return <DeckDisplay deck={deck} owned validation={validation} />;
}

export default DeckView;
