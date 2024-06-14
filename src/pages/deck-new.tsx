import { AppLayout } from "../components/layouts/app_layout";
import { CenterLayout } from "../components/layouts/center_layout";

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
