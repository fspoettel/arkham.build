import type { ChartableData, ResolvedDeck } from "@/store/lib/types";
import type { FactionName } from "@/utils/constants";
import { useMemo } from "react";
import { CostCurveChart } from "./cost-curve-chart";
import css from "./deck-tools.module.css";
import { FactionsChart } from "./factions-chart";
import { SkillIconsChart } from "./skill-icons-chart";

export default function ChartContainer(props: {
  deck: ResolvedDeck;
}) {
  const { deck } = props;

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
    <div className={css["charts-wrap"]}>
      <CostCurveChart data={refinedCostCurve} />
      <SkillIconsChart data={deck.stats.charts.skillIcons} />
      <FactionsChart data={refinedFactions} />
    </div>
  );
}
