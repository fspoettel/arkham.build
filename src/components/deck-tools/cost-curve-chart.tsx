import type { ChartableData } from "@/store/lib/types";
import { cx } from "@/utils/cx";
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
  return `${y} card${y !== 1 ? "s" : ""} of cost ${x}${x === 7 ? "+" : ""}`;
}

export default function CostCurveChart({ data }: Props) {
  // Must have explicit column values to avoid auto-interpolation,
  // since no card costs 1.5 resources
  // Creates a [0...n] array of numbers
  const tickValues = useMemo(
    () => Array.from({ length: data.length }, (_, i) => i),
    [data],
  );

  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={cx(css["chart-container"], css["fullsize"])}>
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
          tickFormat={formatCodomainTickLabels}
          tickLabelComponent={<VictoryLabel />}
        />
        <VictoryLine data={data} animate={animateProps} width={width} />
        <VictoryScatter
          data={data}
          size={5}
          labels={formatTooltips}
          animate={animateProps}
          labelComponent={
            <VictoryTooltip flyoutWidth={125} constrainToVisibleArea />
          }
        />
      </VictoryChart>
    </div>
  );
}
