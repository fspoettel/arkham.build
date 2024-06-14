import clsx from "clsx";

type Props = {
  className?: string;
  cost?: string | number | null;
};

export function CostIcon({ className, cost }: Props) {
  const costStr = cost == null ? "numnull" : cost === -2 ? "x" : `num${cost}`;

  return <i className={clsx(className, `icon-${costStr}`)} />;
}
