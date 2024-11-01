import { useEffect } from "react";

import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { Filters } from "@/components/filters/filters";
import { ListLayout } from "@/layouts/list-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors/shared";
import { useDocumentTitle } from "@/utils/use-document-title";

import { CardListContainer } from "@/components/card-list/card-list-container";
import { DeckCollection } from "./deck-collection/deck-collection";

function Browse() {
  const activeListId = useStore((state) => state.activeList);
  const isInitalized = useStore(selectIsInitialized);
  useDocumentTitle("Browse");

  const setActiveList = useStore((state) => state.setActiveList);

  useEffect(() => {
    setActiveList("browse_player");
  }, [setActiveList]);

  if (!isInitalized || !activeListId?.startsWith("browse")) return null;

  return (
    <CardModalProvider>
      <ListLayout
        filters={<Filters />}
        sidebar={<DeckCollection />}
        sidebarWidthMax="var(--sidebar-width-one-col)"
      >
        {(props) => <CardListContainer {...props} />}
      </ListLayout>
    </CardModalProvider>
  );
}

export default Browse;
