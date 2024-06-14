import { AppLayout } from "@/components/layouts/app_layout";
import { CenterLayout } from "@/components/layouts/center_layout";

export function Index() {
  return (
    <AppLayout filters={"Card filters"} sidebar={"Deck list"}>
      <CenterLayout top="Card search"> </CenterLayout>
    </AppLayout>
  );
}
