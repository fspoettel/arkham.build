import type { ResolvedDeck } from "@/store/lib/types";
import { Plane } from "../ui/plane";
import { CostCurveChart } from "./cost-curve-chart";
import css from "./deck-tools.module.css";
import { FactionsChart } from "./factions-chart";
import { SkillIconsChart } from "./skill-icons-chart";

export default function ChartContainer(props: {
  deck: ResolvedDeck;
}) {
  const { deck } = props;

  return (
    <Plane className={css["charts-wrap"]}>
      <CostCurveChart data={deck.stats.charts.costCurve} />
      <SkillIconsChart data={deck.stats.charts.skillIcons} />
      <FactionsChart data={deck.stats.charts.factions} />
    </Plane>
  );
}
