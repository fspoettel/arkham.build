import type { ChartableData } from "@/store/lib/types";
import { useMemo } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryPolarAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory";
import { SkillIconFancy } from "../icons/skill-icon-fancy";
import { animateProps, chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<string>;
};

function formatTickLabels(value: string) {
  return value.replace("skill_", "");
}

function formatTooltips(value: { datum: { y: number } }) {
  return `${value.datum.y} card${value.datum.y !== 1 ? "s" : ""}`;
}

type SkillIconLabelProps = {
  text?: string;
  x?: number;
  y?: number;
};

export function SkillIconLabel(props: SkillIconLabelProps) {
  const { text, x, y } = props;

  return (
    <foreignObject x={(x || 0) - 12} y={(y || 0) - 12} width={24} height={24}>
      <SkillIconFancy
        skill={text || "wild"}
        className={css["skill-icon-label"]}
      />
    </foreignObject>
  );
}

export default function CostCurveChart({ data }: Props) {
  const maxAmount = useMemo(
    () => Math.max(...data.map((column) => column.y)) + 1,
    [data],
  );

  return (
    <div className={css["chart-container"]}>
      <h3 className="chart-title">Skill icons</h3>
      <VictoryChart theme={chartsTheme} polar padding={25}>
        <VictoryPolarAxis
          animate={animateProps}
          tickFormat={formatTickLabels}
          tickLabelComponent={<SkillIconLabel />}
          style={{
            tickLabels: {
              padding: 20,
            },
          }}
        />
        <VictoryPolarAxis
          dependentAxis
          domain={[0, maxAmount + 1]}
          style={{ tickLabels: { fill: "none" }, axis: { stroke: "none" } }}
        />
        <VictoryLine data={data} animate={animateProps} />
        <VictoryScatter
          data={data}
          size={5}
          animate={animateProps}
          labels={formatTooltips}
          style={{
            labels: {
              padding: 10,
            },
          }}
          labelComponent={<VictoryTooltip labelPlacement="vertical" />}
        />
      </VictoryChart>
    </div>
  );
}
