import css from "./deck-tools.module.css";

type ChartTooltipProps<TData> = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: TData }>;
  formatter: (data: TData) => React.ReactNode;
};

export function ChartTooltip<TData>({
  active,
  payload,
  formatter,
}: ChartTooltipProps<TData>) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className={css["chart-tooltip"]}>{formatter(payload[0].payload)}</div>
  );
}
