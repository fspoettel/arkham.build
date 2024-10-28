import type { ResolvedDeck } from "@/store/lib/types";
import { Suspense, lazy } from "react";
import css from "./deck-tools.module.css";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));
const LazySkillIconsChart = lazy(() => import("./skill-icons-chart"));
const LazyFactionsChart = lazy(() => import("./factions-chart"));

type Props = {
  deck: ResolvedDeck;
};

export const DeckTools = ({ deck }: Props) => {
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <h3 className={css["tools-title"]}>Deck Tools</h3>
      <div className={css["charts-wrap"]}>
        <LazyCostCurveChart data={deck.stats.charts.costCurve} />
        <LazySkillIconsChart data={deck.stats.charts.skillIcons} />
        <LazyFactionsChart data={deck.stats.charts.factions} />
      </div>
    </Suspense>
  );
};
