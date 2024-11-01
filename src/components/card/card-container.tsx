import { cx } from "@/utils/cx";
import css from "./card.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  size: "compact" | "tooltip" | "full";
} & React.HTMLAttributes<HTMLDivElement>;

export function CardContainer(props: Props) {
  const { children, className, size, ...rest } = props;
  return (
    <div {...rest} className={cx(css["container"], css[size], className)}>
      {children}
    </div>
  );
}
