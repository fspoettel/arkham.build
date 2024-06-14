import css from "./center-layout.module.css";

type Props = {
  children: React.ReactNode;
  top?: React.ReactNode;
};

export function CenterLayout({ children, top }: Props) {
  return (
    <div className={css["layout"]}>
      {top && <div className={css["top"]}>{top}</div>}
      <div className={css["main"]}>{children}</div>
    </div>
  );
}
