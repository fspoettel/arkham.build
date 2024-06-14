import { Save } from "lucide-react";
import { useCallback } from "react";
import { Link, useLocation } from "wouter";

import { CardList } from "@/components/card-list/card-list";
import { Filters } from "@/components/filters/filters";
import { ListLayout } from "@/components/layouts/list-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import {
  selectActiveDeck,
  selectCardQuantities,
} from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./deck-edit.module.css";

import { DeckEditSidebar } from "./deck-edit-sidebar";

function DeckEdit() {
  const [, navigate] = useLocation();
  const showToast = useToast();
  const deck = useStore(selectActiveDeck);
  const quantities = useStore(selectCardQuantities);

  const saveDeck = useStore((state) => state.saveDeck);

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

  if (!deck) return null;

  return (
    <ListLayout
      filters={<Filters hiddenFilters={["investigator", "taboo_set"]} />}
      mastheadContent={
        <div className={css["deck-edit-actions"]}>
          <Button onClick={handleSave}>
            <Save />
            Save
          </Button>
          <Link asChild to={`~/deck/${deck.id}/view`}>
            <Button variant="bare">Close</Button>
          </Link>
        </div>
      }
      sidebar={<DeckEditSidebar deck={deck} />}
      sidebarWidthMax="42rem"
    >
      <CardList quantities={quantities} />
    </ListLayout>
  );
}

export default DeckEdit;
