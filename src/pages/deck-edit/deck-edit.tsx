import { useCallback, useEffect } from "react";
import { Redirect } from "wouter";

import { ListLayout } from "@//layouts/list-layout";
import { CardList } from "@/components/card-list/card-list";
import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Filters } from "@/components/filters/filters";
import { useStore } from "@/store";
import { selectActiveDeck, selectDeckValid } from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import { Editor } from "./editor/editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

function DeckEdit() {
  const cardModalContext = useCardModalContext();
  const deckId = useStore((state) => state.deckView?.id);
  const activeListId = useStore((state) => state.activeList);
  const deck = useStore(selectActiveDeck);

  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);

  const validation = useStore(selectDeckValid);

  useEffect(() => {
    setActiveList("editor_player");
    return () => {
      resetFilters();
    };
  }, [resetFilters, setActiveList]);

  useDocumentTitle(
    deck ? `Edit: ${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  const onOpenModal = useCallback(
    (code: string) => {
      cardModalContext.setOpen({ code, deckId, canEdit: true });
    },
    [cardModalContext, deckId],
  );

  if (deckId && !deck) {
    return <Redirect to="/404" />;
  }

  if (!deck || !activeListId?.startsWith("editor")) return null;

  return (
    <ListLayout
      filters={
        <Filters>
          <DecklistValidation defaultOpen={false} validation={validation} />
          <ShowUnusableCardsToggle />
        </Filters>
      }
      sidebar={
        <Editor deck={deck} onOpenModal={onOpenModal} validation={validation} />
      }
      sidebarWidthMax="42rem"
    >
      {(props) => <CardList canEdit {...props} onOpenModal={onOpenModal} />}
    </ListLayout>
  );
}

export default DeckEdit;
