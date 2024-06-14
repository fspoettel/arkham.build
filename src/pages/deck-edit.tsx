import { AppLayout } from "../components/layouts/app-layout";
import { CenterLayout } from "../components/layouts/center-layout";

export function DeckEdit() {
  return (
    <AppLayout filters={"Card filters"} sidebar={"Card list"} title="Edit deck">
      <CenterLayout top="Card search">Card listing</CenterLayout>
    </AppLayout>
  );
}
