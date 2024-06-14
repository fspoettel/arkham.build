import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";

import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { ListLayout } from "@/layouts/list-layout";
import { useStore } from "@/store";
import { useGoBack } from "@/utils/useBack";

import { DeckCollection } from "../browse/deck-collection/deck-collection";

function DeckNew() {
  const goBack = useGoBack();

  const activeListId = useStore((state) => state.activeList);
  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);

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
      sidebarWidthMax="42rem"
    />
  );
}

export default DeckNew;
