import { useCallback, useEffect } from "react";

import { CardList } from "@/components/card-list/card-list";
import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { Filters } from "@/components/filters/filters";
import { ListLayout } from "@/layouts/list-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors/shared";
import { useDocumentTitle } from "@/utils/use-document-title";

import { DeckCollection } from "./deck-collection/deck-collection";

function Browse() {
  const cardModalContext = useCardModalContext();
  const activeListId = useStore((state) => state.activeList);
  const isInitalized = useStore(selectIsInitialized);
  useDocumentTitle("Browse");

  const setActiveList = useStore((state) => state.setActiveList);

  useEffect(() => {
    setActiveList("browse_player");
  }, [setActiveList]);

  const onOpenModal = useCallback(
    (code: string) => {
      cardModalContext.setOpen({ code });
    },
    [cardModalContext],
  );

  if (!isInitalized || !activeListId?.startsWith("browse")) return null;

  return (
    <ListLayout
      filters={<Filters />}
      sidebar={<DeckCollection />}
      sidebarWidthMax="var(--sidebar-width-one-col)"
    >
      {(props) => <CardList {...props} onOpenModal={onOpenModal} />}
    </ListLayout>
  );
}

export default Browse;
