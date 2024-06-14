import { AppLayout } from "@/components/layouts/app_layout";
import { CenterLayout } from "@/components/layouts/center_layout";
import { useStore } from "@/store";

export function Index() {
  const cycles = useStore((s) => s.cycles);
  console.log(cycles);
  return (
    <AppLayout filters={"Card filters"} sidebar={"Deck list"}>
      <CenterLayout top="Card search"> </CenterLayout>
    </AppLayout>
  );
}
