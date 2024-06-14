import clsx from "clsx";

type Props = {
  className?: string;
  cost?: string | number | null;
  style?: React.CSSProperties;
};

export function CostIcon({ className, cost, style }: Props) {
  const costStr = cost == null ? "numNull" : cost === -2 ? "x" : `num${cost}`;

  if (cost && typeof cost === "number" && cost >= 10) {
    return (
      <span className={className}>
        <CostIcon cost={cost.toString().split("")[0]} />
        <CostIcon cost={cost.toString().split("")[1]} />
      </span>
    );
  }

  return <span className={clsx(className, `icon-${costStr}`)} style={style} />;
}
