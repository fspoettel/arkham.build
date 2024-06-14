import { ReactNode } from "react";
import css from "./center_layout.module.css";

type Props = {
  children: ReactNode;
  top: ReactNode;
};

export function CenterLayout({ children, top }: Props) {
  return (
    <section className={css["layout"]}>
      <div className={css["layout-top"]}>{top}</div>
      <div className={css["layout-main"]}>{children}</div>
    </section>
  );
}
