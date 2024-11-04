import { useStore } from "@/store";
import type {
  ChartableData,
  FactionName,
  ResolvedDeck,
} from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { X } from "lucide-react";
import { Suspense, lazy, useMemo } from "react";
import layoutCss from "../../layouts/list-layout.module.css";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import css from "./deck-tools.module.css";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));
const LazySkillIconsChart = lazy(() => import("./skill-icons-chart"));
const LazyFactionsChart = lazy(() => import("./factions-chart"));

type Props = {
  deck: ResolvedDeck;
};

export const DeckTools = ({ deck }: Props) => {
  const active = useStore((state) => state.ui.usingDeckTools);
  const setUsingDeckTools = useStore((state) => state.setUsingDeckTools);

  // Ensure that all resource costs (up to the maximum cost)
  // have an actual entry (even if its value is 0)
  const refinedCostCurve = useMemo((): ChartableData => {
    return deck.stats.charts.costCurve.map((tick, index) => {
      return tick ?? { x: index, y: 0 };
    });
  }, [deck]);

  // Remove factions not in the deck so that they don't show as empty labels
  const refinedFactions = useMemo((): ChartableData<FactionName> => {
    return deck.stats.charts.factions.filter((tick) => tick.y !== 0);
  }, [deck]);

  return (
    <div
      className={cx(
        layoutCss["layout-area"],
        css["deck-tools"],
        active && css["transition"],
      )}
    >
      <div className={css["tools-header"]}>
        <h3 className={css["tools-title"]}>Deck Tools</h3>
        <Button iconOnly size="lg" onClick={() => setUsingDeckTools(false)}>
          <X />
        </Button>
      </div>
      {active && (
        <Suspense fallback={<Loader show message="Loading tools..." />}>
          <div className={css["charts-wrap"]}>
            <LazyCostCurveChart data={refinedCostCurve} />
            <LazySkillIconsChart data={deck.stats.charts.skillIcons} />
            <LazyFactionsChart data={refinedFactions} />
          </div>
        </Suspense>
      )}
    </div>
  );
};
