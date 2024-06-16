import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";

import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { ListLayout } from "@/layouts/list-layout";
import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";
import { useGoBack } from "@/utils/use-go-back";

import { DeckCollection } from "../browse/deck-collection/deck-collection";

function DeckCreateChooseInvestigator() {
  const goBack = useGoBack();

  const activeListId = useStore((state) => state.activeList);
  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);

  useDocumentTitle("Choose investigator");

  useEffect(() => {
    setActiveList("create_deck");
    return () => {
      resetFilters();
    };
  }, [resetFilters, setActiveList]);

  if (activeListId !== "create_deck") return null;

  return (
    <ListLayout
      filters={<Filters />}
      mastheadContent={
        <Button onClick={goBack}>
          <ChevronLeft />
          Back
        </Button>
      }
      sidebar={<DeckCollection />}
      sidebarWidthMax="var(--sidebar-width-one-col)"
    />
  );
}

export default DeckCreateChooseInvestigator;
