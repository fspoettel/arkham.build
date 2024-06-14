import { AppLayout } from "../components/layouts/app_layout";
import { CenterLayout } from "../components/layouts/center_layout";

export function DeckEdit() {
  return (
    <AppLayout filters={"Card filters"} sidebar={"Card list"} title="Edit deck">
      <CenterLayout top="Card search">Card listing</CenterLayout>
    </AppLayout>
  );
}
