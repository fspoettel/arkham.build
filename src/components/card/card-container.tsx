import clsx from "clsx";

import css from "./card.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  size: "compact" | "tooltip" | "full";
} & React.HTMLAttributes<HTMLDivElement>;

export function CardContainer({ children, className, size, ...rest }: Props) {
  return (
    <div className={clsx(css["container"], css[size], className)} {...rest}>
      {children}
    </div>
  );
}
