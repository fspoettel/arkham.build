import clsx from "clsx";
import type { CSSProperties } from "react";

type Props = {
  className?: string;
  cost?: string | number | null;
  style?: CSSProperties;
};

export function CostIcon({ className, cost, style }: Props) {
  const costStr = cost == null ? "numnull" : cost === -2 ? "x" : `num${cost}`;

  if (cost && typeof cost === "number" && cost >= 10) {
    return (
      <span className={className}>
        <CostIcon
          cost={cost.toString().split("")[0]}
          style={{ verticalAlign: "middle" }}
        />
        <CostIcon
          cost={cost.toString().split("")[1]}
          style={{ verticalAlign: "middle" }}
        />
      </span>
    );
  }

  return <span className={clsx(className, `icon-${costStr}`)} style={style} />;
}
