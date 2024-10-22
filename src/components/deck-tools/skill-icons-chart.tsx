import type { ChartableData } from "@/store/lib/types";
import { useMemo } from "react";
import {
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPolarAxis,
} from "victory";
import { SkillIconFancy } from "../icons/skill-icon-fancy";
import { animateProps, chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<string>;
};

function formatTickLabels(value: number) {
  return `${value}`;
}
type SkillIconLabelProps = {
  text?: string;
  x?: number;
  y?: number;
};

export function SkillIconLabel(props: SkillIconLabelProps) {
  const { text, x, y } = props;
  const skillName = useMemo(() => text?.replace("skill_", ""), [text]);

  console.log(props);

  return (
    <foreignObject x={x} y={y} width={50} height={50}>
      <SkillIconFancy
        skill={skillName || "wild"}
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
      <VictoryChart theme={chartsTheme} polar>
        <VictoryPolarAxis
          animate={animateProps}
          tickFormat={formatTickLabels}
          tickLabelComponent={<SkillIconLabel />}
        />
        <VictoryPolarAxis
          dependentAxis
          domain={[0, maxAmount]}
          tickLabelComponent={<VictoryLabel dx={-5} />}
        />
        <VictoryLine data={data} animate={animateProps} polar />
      </VictoryChart>
    </div>
  );
}
