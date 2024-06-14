import { useEffect } from "react";
import { useParams } from "wouter";

import { CardList } from "@/components/card-list/card-list";
import { CardSearch } from "@/components/card-list/card-search";
import { Filters } from "@/components/filters/filters";

import { AppLayout } from "../../components/layouts/app-layout";
import { CenterLayout } from "../../components/layouts/center-layout";

export function DeckEdit() {
  const params = useParams();

  useEffect(() => {
    console.log(params.id);
  }, [params]);

  return (
    <AppLayout
      closeable={<Filters hiddenFilters={["investigator"]} />}
      sidebar={"Deck list"}
      title="Edit deck"
    >
      <CenterLayout top={<CardSearch />}>
        <CardList />
      </CenterLayout>
    </AppLayout>
  );
}
