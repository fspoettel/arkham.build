import { CardList } from "@/components/card-list/card-list";
import { Filters } from "@/components/filters/filters";
import { ListLayout } from "@/components/layouts/list-layout";
import { useStore } from "@/store";
import {
  selectActiveDeck,
  selectCardQuantities,
} from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import { DeckEditSidebar } from "./deck-edit-sidebar";

function DeckEdit() {
  const deck = useStore(selectActiveDeck);
  const quantities = useStore(selectCardQuantities);

  useDocumentTitle(
    deck ? `Edit: ${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  if (!deck) return null;

  return (
    <ListLayout
      filters={<Filters hiddenFilters={["investigator", "taboo_set"]} />}
      sidebar={<DeckEditSidebar deck={deck} />}
      sidebarWidthMax="42rem"
    >
      <CardList canEdit canShowQuantities quantities={quantities} />
    </ListLayout>
  );
}

export default DeckEdit;
