import { CardList } from "@/components/card-list/card-list";
import { CardSearch } from "@/components/card-list/card-search";
import { Filters } from "@/components/filters/filters";
import { AppLayout } from "@/components/layouts/app-layout";
import { CenterLayout } from "@/components/layouts/center-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";

export function Index() {
  const isInitalized = useStore(selectIsInitialized);

  if (!isInitalized) return null;

  return (
    <AppLayout filters={<Filters />} sidebar={"Deck list"} title="Index">
      <CenterLayout top={<CardSearch />}>
        <CardList />
      </CenterLayout>
    </AppLayout>
  );
}
