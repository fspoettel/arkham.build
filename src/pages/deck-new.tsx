import { Filters } from "@/components/filters/filters";

import { AppLayout } from "../components/layouts/app-layout";
import { CenterLayout } from "../components/layouts/center-layout";

export function DeckNew() {
  return (
    <AppLayout closeable={<Filters />} title="New deck">
      <CenterLayout>Investigator listing</CenterLayout>
    </AppLayout>
  );
}
