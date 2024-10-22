import type { ResolvedDeck } from "@/store/lib/types";
import { Suspense, lazy } from "react";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));

type Props = {
  deck: ResolvedDeck;
};

export function DeckUtils({ deck }: Props) {
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <LazyCostCurveChart data={deck.stats.charts.costCurve} />
    </Suspense>
  );
}
