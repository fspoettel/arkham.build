import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { X } from "lucide-react";
import { Suspense, lazy } from "react";
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
            <LazyCostCurveChart data={deck.stats.charts.costCurve} />
            <LazySkillIconsChart data={deck.stats.charts.skillIcons} />
            <LazyFactionsChart data={deck.stats.charts.factions} />
          </div>
        </Suspense>
      )}
    </div>
  );
};
