import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Suspense, lazy } from "react";
import layoutCss from "../../layouts/list-layout.module.css";
import css from "./deck-tools.module.css";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));
const LazySkillIconsChart = lazy(() => import("./skill-icons-chart"));
const LazyFactionsChart = lazy(() => import("./factions-chart"));

type Props = {
  deck: ResolvedDeck;
};

export const DeckTools = ({ deck }: Props) => {
  const active = useStore((state) => state.ui.usingDeckTools);

  console.log(active);

  return (
    <Suspense fallback={<div>LOADING</div>}>
      <div
        className={cx(
          layoutCss["layout-area"],
          css["deck-tools"],
          active && css["active"],
        )}
      >
        <h3 className={css["tools-title"]}>Deck Tools</h3>
        <div className={css["charts-wrap"]}>
          <LazyCostCurveChart data={deck.stats.charts.costCurve} />
          <LazySkillIconsChart data={deck.stats.charts.skillIcons} />
          <LazyFactionsChart data={deck.stats.charts.factions} />
        </div>
      </div>
    </Suspense>
  );
};
