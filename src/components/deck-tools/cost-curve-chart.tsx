import type { ChartableData } from "@/store/lib/types";
import { useMemo } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from "victory";
import { animateProps, chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData;
};

function formatTickLabels(value: number) {
  return value === 7 ? "7+" : value.toString();
}

function formatTooltips(value: { datum: { y: number } }) {
  return `${value.datum.y} card${value.datum.y !== 1 ? "s" : ""}`;
}

export default function CostCurveChart({ data }: Props) {
  // Must have explicit column values to avoid auto-interpolation,
  // since no card costs 1.5 resources
  // Creates a [0...n] array of numbers
  const tickValues = useMemo(
    () => Array.from({ length: (data?.at(-1)?.x || 0) + 1 }, (_, i) => i),
    [data],
  );
  const maxAmount = useMemo(
    () => Math.max(...data.map((column) => column.y)) + 1,
    [data],
  );

  return (
    <div className={css["chart-container"]}>
      <VictoryChart theme={chartsTheme}>
        <VictoryAxis
          tickValues={tickValues}
          animate={animateProps}
          tickFormat={formatTickLabels}
          style={{ grid: { stroke: "transparent" } }}
          tickLabelComponent={<VictoryLabel dy={5} />}
        />
        <VictoryAxis
          dependentAxis
          domain={[0, maxAmount]}
          tickLabelComponent={<VictoryLabel dx={-5} />}
        />
        <VictoryLine data={data} animate={animateProps} />
        <VictoryScatter
          data={data}
          size={5}
          animate={animateProps}
          labels={formatTooltips}
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </div>
  );
}
