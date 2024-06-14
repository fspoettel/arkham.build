import { AppLayout } from "../components/layouts/app-layout";
import { CenterLayout } from "../components/layouts/center-layout";

export function DeckNew() {
  return (
    <AppLayout
      filters={"Investigator filters"}
      sidebar={"Deck list"}
      title="New deck"
    >
      <CenterLayout top="Investigator search">
        Investigator listing
      </CenterLayout>
    </AppLayout>
  );
}
