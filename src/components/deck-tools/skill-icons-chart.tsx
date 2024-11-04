import type { ChartableData } from "@/store/lib/types";
import { useRef } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryPolarAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory";
import { useElementSize } from "../../utils/use-element-size";
import { SkillIconFancy } from "../icons/skill-icon-fancy";
import { chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<string>;
};

export function SkillIconsChart({ data }: Props) {
  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={css["chart-container"]}>
      {width > 0 && (
        <>
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
            <VictoryLine data={data} />
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
        </>
      )}
    </div>
  );
}

function formatTickLabels(value: string) {
  return value.replace("skill_", "");
}

function formatTooltips(value: { datum: { y: number } }) {
  return `${value.datum.y} symbol${value.datum.y !== 1 ? "s" : ""}`;
}

function SkillIconLabel(props: {
  text?: string;
  x?: number;
  y?: number;
}) {
  const { text, x, y } = props;
  const SKILL_ICON_SIZE = 24;

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
