import { CardList } from "@/components/card-list/card-list";
import { Filters } from "@/components/filters/filters";
import { ListLayout } from "@/layouts/list-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";
import { useDocumentTitle } from "@/utils/use-document-title";

import { DeckCollection } from "./deck-collection/deck-collection";

function Browse() {
  const isInitalized = useStore(selectIsInitialized);
  useDocumentTitle("Browse");

  if (!isInitalized) return null;

  return (
    <ListLayout
      filters={<Filters />}
      sidebar={<DeckCollection />}
      sidebarWidthMax="var(--sidebar-width-one-col)"
    >
      <CardList />
    </ListLayout>
  );
}

export default Browse;
