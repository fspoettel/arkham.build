import type { ChartableData, Factions } from "@/store/lib/types";
import { capitalize } from "@/utils/formatting";
import { useRef } from "react";
import { VictoryPie } from "victory";
import { chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";
import { useElementSize } from "./utils";

type Props = {
  data: ChartableData<Factions>;
};

export default function FactionsChart({ data }: Props) {
  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={css["chart-container"]}>
      <h4 className={css["chart-title"]}>Skill icons</h4>
      <VictoryPie
        height={200}
        data={data}
        theme={chartsTheme}
        labels={({ datum }) => capitalize(datum.xName)}
        width={width}
        style={{
          data: {
            fill: (d) => `var(--${d.datum.xName}`,
          },
        }}
      />
    </div>
  );
}
