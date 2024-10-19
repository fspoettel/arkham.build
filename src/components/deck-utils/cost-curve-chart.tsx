import { useMemo } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory";

type Props = {
  values: { x: number; y: number }[];
};

export default function CostCurveChart({ values }: Props) {
  const { maxAmount, tickValues } = useMemo(() => {
    let maxAmount = 0;
    const tickValues = [];
    for (const value of values) {
      maxAmount = Math.max(value.y, maxAmount);
      tickValues.push(value.x);
    }

    return { maxAmount, tickValues };
  }, [values]);

  return (
    <div data-testid="card-health">
      <VictoryChart
        height={300}
        theme={VictoryTheme.material}
        animate={{
          duration: 550,
          easing: "expInOut",
          onLoad: { duration: 150 },
        }}
      >
        <VictoryAxis tickValues={tickValues} />
        <VictoryAxis dependentAxis domain={[0, maxAmount + 1]} />
        <VictoryLine data={values} />
        <VictoryScatter data={values} size={5} />
      </VictoryChart>
    </div>
  );
}
