import type { ChartableData, Factions } from "@/store/lib/types";
import { capitalize } from "@/utils/formatting";
import { VictoryPie } from "victory";
import { chartsTheme } from "./chart-theme";
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
        theme={chartsTheme}
        labels={({ datum }) => capitalize(datum.xName)}
        style={{
          labels: {
            fontSize: 10,
            padding: 10,
          },
          data: {
            fill: (d) => `var(--${d.datum.xName}`,
          },
        }}
      />
    </div>
  );
}
