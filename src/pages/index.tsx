import { CardList } from "@/components/card-list/card-list";
import { CardSearch } from "@/components/card-search";
import { Filters } from "@/components/filters/filters";
import { AppLayout } from "@/components/layouts/app_layout";
import { CenterLayout } from "@/components/layouts/center_layout";

export function Index() {
  return (
    <AppLayout filters={<Filters />} sidebar={"Deck list"}>
      <CenterLayout top={<CardSearch />}>
        <CardList />
      </CenterLayout>
    </AppLayout>
  );
}
