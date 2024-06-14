import { Save } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Redirect, useLocation } from "wouter";

import { ListLayout } from "@//layouts/list-layout";
import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { selectActiveDeck } from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./deck-edit.module.css";

import { Editor } from "./editor/editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

function DeckEdit() {
  const [, navigate] = useLocation();
  const showToast = useToast();

  const deckId = useStore((state) => state.deckView?.id);
  const activeListId = useStore((state) => state.activeList);
  const deck = useStore(selectActiveDeck);
  const dirty = useStore((state) =>
    state?.deckView?.mode === "edit" ? state.deckView.dirty : false,
  );

  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);
  const saveDeck = useStore((state) => state.saveDeck);

  useEffect(() => {
    setActiveList("editor_player");
    return () => {
      resetFilters();
    };
  }, [resetFilters, setActiveList]);

  const handleSave = useCallback(() => {
    const id = saveDeck();
    navigate(`/deck/view/${id}`);

    showToast({
      children: "Deck saved successfully.",
      variant: "success",
    });
  }, [saveDeck, navigate, showToast]);

  const handleCancel = useCallback(async () => {
    if (!deck?.id) return;

    const confirmed =
      !dirty ||
      confirm(
        "This operation will revert the changes made to the deck. Do you want to continue?",
      );
    if (confirmed) navigate(`/deck/view/${deck.id}`);
  }, [navigate, deck?.id, dirty]);

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
          <ShowUnusableCardsToggle />
        </Filters>
      }
      mastheadContent={
        <div className={css["actions"]}>
          <Button onClick={handleSave} size="lg">
            <Save />
            Save
          </Button>
          <Button onClick={handleCancel} size="lg" variant="bare">
            Cancel edits
          </Button>
        </div>
      }
      sidebar={<Editor deck={deck} />}
      sidebarWidthMax="42rem"
    />
  );
}

export default DeckEdit;
