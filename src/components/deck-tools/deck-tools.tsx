import type { ResolvedDeck } from "@/store/lib/types";
import { Suspense, lazy } from "react";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));
const LazySkillIconsChart = lazy(() => import("./skill-icons-chart"));

type Props = {
  deck: ResolvedDeck;
};

export const DeckTools = ({ deck }: Props) => {
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <LazyCostCurveChart data={deck.stats.charts.costCurve} />
      <LazySkillIconsChart data={deck.stats.charts.skillIcons} />
    </Suspense>
  );
};
