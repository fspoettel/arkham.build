import type { ChartableData, FactionName } from "@/store/lib/types";
import { capitalize } from "@/utils/formatting";
import { useRef } from "react";
import { VictoryPie } from "victory";
import { chartsTheme } from "./chart-theme";
import css from "./deck-tools.module.css";
import { useElementSize } from "./utils";

type Props = {
  data: ChartableData<FactionName>;
};

export default function FactionsChart({ data }: Props) {
  const ref = useRef(null);
  const { width } = useElementSize(ref);

  return (
    <div ref={ref} className={css["chart-container"]}>
      <h4 className={css["chart-title"]}>Factions</h4>
      <VictoryPie
        data={data}
        theme={chartsTheme}
        labels={({ datum }) => capitalize(datum.xName)}
        width={width}
        sortKey={"y"}
        style={{
          data: {
            fill: ({ datum }) =>
              `var(--${datum.xName === "neutral" ? "text" : "color"}-${
                datum.xName
              })`,
          },
        }}
      />
    </div>
  );
}
