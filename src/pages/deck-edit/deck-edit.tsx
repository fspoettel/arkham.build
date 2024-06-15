import { useEffect } from "react";
import { Redirect } from "wouter";

import { ListLayout } from "@//layouts/list-layout";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Filters } from "@/components/filters/filters";
import { useStore } from "@/store";
import { selectActiveDeck } from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import { Editor } from "./editor/editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

function DeckEdit() {
  const deckId = useStore((state) => state.deckView?.id);
  const activeListId = useStore((state) => state.activeList);
  const deck = useStore(selectActiveDeck);

  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);

  useEffect(() => {
    setActiveList("editor_player");
    return () => {
      resetFilters();
    };
  }, [resetFilters, setActiveList]);

  useDocumentTitle(
    deck ? `Edit: ${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  if (deckId && !deck) {
    return <Redirect to="/404" />;
  }

  if (!deck || !activeListId?.startsWith("editor")) return null;

  return (
    <ListLayout
      filters={
        <Filters>
          <DecklistValidation defaultOpen={false} />
          <ShowUnusableCardsToggle />
        </Filters>
      }
      sidebar={<Editor deck={deck} />}
      sidebarWidthMax="42rem"
    />
  );
}

export default DeckEdit;
