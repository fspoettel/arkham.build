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

  // Must have explicit tick values to avoid auto-interpolation,
  // since no card costs 1.5 resources, and you can't have 0.5 cards
  const domainTickValues = useMemo(() => getDiscreteArray(data.length), [data]);
  const codomainTickValues = useMemo(() => {
    const maxAmount = data.reduce(
      (acc, value) => Math.max(value?.y ?? 0, acc),
      0,
    );
    return getDiscreteArray(maxAmount + 1);
  }, [data]);

  console.log(codomainTickValues, "codomain Tick Values");

  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={cx(css["chart-container"], css["fullsize"])}>
      {width > 0 && (
        <>
          <h4 className={css["chart-title"]}>Resource costs</h4>
          <VictoryChart
            theme={chartsTheme}
            padding={{ left: 45, bottom: 40, right: 5 }}
            containerComponent={<VictoryContainer responsive={false} />}
            width={width}
          >
            <VictoryAxis
              tickValues={domainTickValues}
              label="Resource cost"
              tickFormat={formatDomainTickLabels}
              style={{ grid: { stroke: "transparent" } }}
              tickLabelComponent={<VictoryLabel />}
            />
            <VictoryAxis
              dependentAxis
              tickValues={codomainTickValues}
              label="Cards"
              tickLabelComponent={<VictoryLabel />}
            />
            <VictoryLine data={normalizedData} width={width} />
            <VictoryScatter
              data={normalizedData}
              size={6}
              labels={formatTooltips}
              labelComponent={
                <VictoryTooltip flyoutWidth={125} constrainToVisibleArea />
              }
            />
          </VictoryChart>
        </>
      )}
    </div>
  );
}

function formatDomainTickLabels(value: number) {
  return value === 7 ? "7+" : value.toString();
}

function formatTooltips(value: { datum: { y: number; x: number } }) {
  const { y, x } = value.datum;
  return `${y} card${y !== 1 ? "s" : ""} of cost ${x}${x === 7 ? "+" : ""}`;
}

// Creates a [0...n] array of numbers
function getDiscreteArray(length: number) {
  return Array.from({ length: length }, (_, i) => i);
}
