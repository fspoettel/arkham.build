import { useState } from "react";
import { toChartableData } from "@/store/lib/deck-charts";
import type { ResolvedDeck } from "@/store/lib/types";
import { Plane } from "../ui/plane";
import type { ChartSelection } from "./chart-cards";
import { ChartCardsModal } from "./chart-cards-modal";
import { CostCurveChart } from "./cost-curve-chart";
import css from "./deck-tools.module.css";
import { FactionsChart } from "./factions-chart";
import { SkillIconsChart } from "./skill-icons-chart";
import { TraitsChart } from "./traits-chart";

export default function ChartContainer(props: { deck: ResolvedDeck }) {
  const { deck } = props;
  const [selection, setSelection] = useState<ChartSelection | null>(null);

  return (
    <>
      <Plane className={css["charts-wrap"]}>
        <SkillIconsChart
          data={toChartableData(deck.stats.charts.skillIcons)}
          onSelect={setSelection}
        />
        <CostCurveChart
          onSelect={setSelection}
          total={deck.stats.deckSizeTotal}
          costs={deck.stats.charts.costs}
          data={toChartableData(deck.stats.charts.costCurve)}
        />
        <TraitsChart
          data={toChartableData(deck.stats.charts.traits, "value")}
          onSelect={setSelection}
        />
        <FactionsChart
          data={toChartableData(deck.stats.charts.factions)}
          onSelect={setSelection}
        />
      </Plane>
      <ChartCardsModal
        deck={deck}
        selection={selection}
        onClose={() => setSelection(null)}
      />
    </>
  );
}
