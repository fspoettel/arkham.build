import { CardList } from "@/components/card-list/card-list";
import { CardSearch } from "@/components/card-list/card-search";
import { DeckCollection } from "@/components/deck-collection/deck-collection";
import { Filters } from "@/components/filters/filters";
import { AppLayout } from "@/components/layouts/app-layout";
import { CenterLayout } from "@/components/layouts/center-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";

export function Browse() {
  const isInitalized = useStore(selectIsInitialized);
  if (!isInitalized) return null;

  return (
    <AppLayout
      closeable={<Filters />}
      sidebar={<DeckCollection />}
      title="Browse"
    >
      <CenterLayout top={<CardSearch />}>
        <CardList />
      </CenterLayout>
    </AppLayout>
  );
}
