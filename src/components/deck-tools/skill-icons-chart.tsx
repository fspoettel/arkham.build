import type { ChartableData } from "@/store/lib/types";
import { useRef } from "react";
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
import { useElementSize } from "./utils";

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

export default function SkillIconsChart({ data }: Props) {
  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={css["chart-container"]}>
      <h4 className={css["chart-title"]}>Skill icons</h4>
      <VictoryChart theme={chartsTheme} polar width={width}>
        <VictoryPolarAxis
          tickFormat={formatTickLabels}
          tickLabelComponent={<SkillIconLabel />}
        />
        <VictoryPolarAxis
          dependentAxis
          style={{ tickLabels: { fill: "none" }, axis: { stroke: "none" } }}
        />
        <VictoryLine data={data} animate={animateProps} />
        <VictoryScatter
          data={data}
          size={5}
          labels={formatTooltips}
          labelComponent={
            <VictoryTooltip
              labelPlacement="vertical"
              flyoutWidth={100}
              constrainToVisibleArea
            />
          }
        />
      </VictoryChart>
    </div>
  );
}
