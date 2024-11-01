import type { ChartableData } from "@/store/lib/types";
import { useMemo, useRef } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from "victory";
import { animateProps, chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";
import { useElementSize } from "./utils";

type Props = {
  data: ChartableData;
};

function formatDomainTickLabels(value: number) {
  return value === 7 ? "7+" : value.toString();
}

function formatCodomainTickLabels(value: number) {
  return value.toFixed(0);
}

function formatTooltips(value: { datum: { y: number; x: number } }) {
  const { y, x } = value.datum;

  return `Cost ${x}${x === 7 ? "+" : ""} :\n ${y} card${y !== 1 ? "s" : ""}`;
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

  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={css["chart-container"]}>
      <h4 className={css["chart-title"]}>Resource costs</h4>
      <VictoryChart
        theme={chartsTheme}
        padding={{ left: 45, bottom: 40, right: 5 }}
        containerComponent={<VictoryContainer responsive={false} />}
        width={width}
      >
        <VictoryAxis
          tickValues={tickValues}
          label="Resource cost"
          tickFormat={formatDomainTickLabels}
          style={{ grid: { stroke: "transparent" } }}
          tickLabelComponent={<VictoryLabel />}
        />
        <VictoryAxis
          dependentAxis
          label="Cards"
          domain={[0, maxAmount]}
          tickFormat={formatCodomainTickLabels}
          tickLabelComponent={<VictoryLabel />}
        />
        <VictoryLine data={data} animate={animateProps} width={width} />
        <VictoryScatter
          data={data}
          size={5}
          labels={formatTooltips}
          animate={animateProps}
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </div>
  );
}
