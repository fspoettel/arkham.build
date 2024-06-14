import { AppLayout } from "@/components/layouts/app_layout";
import { CenterLayout } from "@/components/layouts/center_layout";
import { useSortedRowIds } from "@/stores/DataStore";

export function Index() {
  const cardIds = useSortedRowIds("cards", "position");

  return (
    <AppLayout filters={"Card filters"} sidebar={"Deck list"}>
      <CenterLayout top="Card search">{cardIds.length}</CenterLayout>
    </AppLayout>
  );
}
