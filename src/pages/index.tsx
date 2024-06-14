import { AppLayout } from "../components/layouts/app_layout";
import { CenterLayout } from "../components/layouts/center_layout";
import { useLocalRowIds, useRelationships } from "../stores/DataStore";

export function Index() {
  const relationships = useRelationships();
  console.log(useLocalRowIds("packCycles", "dwl", relationships));

  return (
    <AppLayout filters={"Card filters"} sidebar={"Deck list"}>
      <CenterLayout top="Card search">
        Card listing
      </CenterLayout>
    </AppLayout>
  );
}
