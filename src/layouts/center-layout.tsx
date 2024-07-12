import clsx from "clsx";
import css from "./center-layout.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  top?: React.ReactNode;
};

export function CenterLayout(props: Props) {
  const { children, className, top } = props;

  return (
    <div className={clsx(css["layout"], className)}>
      {top && <div className={css["top"]}>{top}</div>}
      <div className={css["main"]}>{children}</div>
    </div>
  );
}
