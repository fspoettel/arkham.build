import type { ChartableData } from "@/store/lib/types";
import type { FactionName } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";
import { useMemo, useRef } from "react";
import {
  VictoryContainer,
  VictoryLabel,
  type VictoryLabelProps,
  VictoryPie,
  VictoryTooltip,
} from "victory";
import { useElementSize } from "../../utils/use-element-size";
import { chartsTheme, containerTheme } from "./chart-theme";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<FactionName>;
};

export function FactionsChart({ data }: Props) {
  const ref = useRef(null);
  const { width } = useElementSize(ref);

  // Remove factions not in the deck so that they don't show as empty labels
  const normalizedData = useMemo((): ChartableData<FactionName> => {
    return data.filter((tick) => tick.y !== 0);
  }, [data]);

  return (
    <div ref={ref} className={css["chart-container"]}>
      {width > 0 && (
        <>
          <h4 className={css["chart-title"]}>Factions</h4>
          <VictoryPie
            containerComponent={
              <VictoryContainer responsive={false} style={containerTheme} />
            }
            data={normalizedData}
            theme={chartsTheme}
            labelPlacement="parallel"
            labelComponent={<CustomLabel />}
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
        </>
      )}
    </div>
  );
}

function CustomLabel(props: VictoryLabelProps) {
  return (
    <g>
      <VictoryLabel {...props} />
      <VictoryTooltip
        // biome-ignore lint/suspicious/noExplicitAny: wrong library typings.
        active={(props as any).active}
        x={props.x}
        y={props.y}
        orientation="bottom"
        angle={0}
        theme={chartsTheme}
        labelPlacement="vertical"
        flyoutWidth={100}
        constrainToVisibleArea
        text={`${props.datum?.y ?? 0} ${capitalize(props.datum?.xName ?? "")} cards`}
      />
    </g>
  );
}

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents;
