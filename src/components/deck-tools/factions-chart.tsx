import type { ChartableData, Factions } from "@/store/lib/types";
import { VictoryPie } from "victory";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<Factions>;
};

export default function FactionsChart({ data }: Props) {
  return (
    <div className={css["chart-container"]}>
      <h4 className={css["chart-title"]}>Skill icons</h4>
      <VictoryPie
        data={data}
        style={{
          data: {
            fill: (d) => `var(--${d.datum.xName}`,
            // For whatever reason pie does not take to the theme?
            stroke: "var(--nord-0)",
            strokeWidth: 2,
          },
        }}
      />
    </div>
  );
}
