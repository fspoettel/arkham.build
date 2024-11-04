import type { ChartableData } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { range } from "@/utils/range";
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
import { useElementSize } from "../../utils/use-element-size";
import { chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData;
};

export function CostCurveChart({ data }: Props) {
  // Ensure that all resource costs (up to the maximum cost)
  // have an actual entry (even if its value is 0)
  const normalizedData = useMemo((): ChartableData => {
    const max = Math.max(...data.filter((x) => x).map((tick) => tick?.x ?? 0));

    return range(0, max + 1).map((cost) => {
      return data[cost] ?? { x: cost, y: 0 };
    });
  }, [data]);

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
        <VictoryLine data={normalizedData} width={width} />
        <VictoryScatter
          data={normalizedData}
          size={5}
          labels={formatTooltips}
          labelComponent={
            <VictoryTooltip flyoutWidth={125} constrainToVisibleArea />
          }
        />
      </VictoryChart>
    </div>
  );
}

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
