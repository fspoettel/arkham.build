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
  return `${value.datum.y} symbol${value.datum.y !== 1 ? "s" : ""}`;
}

type SkillIconLabelProps = {
  text?: string;
  x?: number;
  y?: number;
};

const SKILL_ICON_SIZE = 24;

export function SkillIconLabel(props: SkillIconLabelProps) {
  const { text, x, y } = props;

  return (
    <foreignObject
      x={(x ?? 0) - SKILL_ICON_SIZE / 2}
      y={(y ?? 0) - SKILL_ICON_SIZE / 2}
      width={SKILL_ICON_SIZE}
      height={SKILL_ICON_SIZE}
    >
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
      <h4 className={css["chart-title"]}>Skill icons</h4>
      <VictoryChart theme={chartsTheme} polar padding={{ bottom: 20, top: 20 }}>
        <VictoryPolarAxis
          tickFormat={formatTickLabels}
          tickLabelComponent={<SkillIconLabel />}
          style={{
            tickLabels: {
              padding: 15,
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
