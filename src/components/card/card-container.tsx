import clsx from "clsx";

import css from "./card.module.css";

type Props = {
  children: React.ReactNode;
  size: "compact" | "tooltip" | "full";
};

export function CardContainer({ children, size }: Props) {
  return (
    <div className={clsx(css["card-container"], css[size])}>{children}</div>
  );
}
