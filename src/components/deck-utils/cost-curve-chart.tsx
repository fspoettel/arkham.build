import type { ChartableData } from "@/store/lib/types";
import { useMemo } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory";
import { animateProps, chartsTheme } from "./chart-theme";

import "../../styles/main.css";

type Props = {
  data: ChartableData;
};

function formatTickLabels(value: number) {
  return value === 7 ? "7+" : value.toString();
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
    <div data-testid="card-health">
      <VictoryChart height={200} theme={chartsTheme} padding={30}>
        <VictoryAxis dependentAxis domain={[0, maxAmount]} />
        <VictoryAxis
          tickValues={tickValues}
          animate={animateProps}
          tickFormat={formatTickLabels}
        />
        <VictoryLine data={data} animate={animateProps} />
        <VictoryScatter data={data} size={5} animate={animateProps} />
      </VictoryChart>
    </div>
  );
}
