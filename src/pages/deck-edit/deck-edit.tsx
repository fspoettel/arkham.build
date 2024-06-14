import { Save } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";

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
  const deck = useStore(selectActiveDeck);
  const activeListId = useStore((state) => state.activeList);

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
    navigate(`~/deck/${id}/edit`, { replace: true });
    showToast({
      children: "Deck saved successfully.",
      variant: "success",
    });
  }, [saveDeck, navigate, showToast]);

  useDocumentTitle(
    deck ? `Edit: ${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

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
          <Button onClick={handleSave}>
            <Save />
            Save
          </Button>
          <Link asChild to={`~/deck/${deck.id}/view`}>
            <Button variant="bare">Close</Button>
          </Link>
        </div>
      }
      sidebar={<Editor deck={deck} />}
      sidebarWidthMax="42rem"
    />
  );
}

export default DeckEdit;
