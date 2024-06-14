import { AppLayout } from "../components/layouts/app-layout";
import { CenterLayout } from "../components/layouts/center-layout";

export function DeckEdit() {
  return (
    <AppLayout
      closeable={"Card filters"}
      sidebar={"Card list"}
      title="Edit deck"
    >
      <CenterLayout top="Card search">Card listing</CenterLayout>
    </AppLayout>
  );
}
