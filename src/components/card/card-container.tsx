import clsx from "clsx";

import css from "./card.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  size: "compact" | "tooltip" | "full";
};

export function CardContainer({ children, className, size }: Props) {
  return (
    <div className={clsx(css["container"], css[size], className)}>
      {children}
    </div>
  );
}
