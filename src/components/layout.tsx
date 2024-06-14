import { ReactNode } from "react";
import css from "./layout.module.css";

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
  filters: ReactNode;
};

export function Layout({ sidebar, children, filters }: Props) {
  return (
    <div className={css["layout"]}>
      <div className={css["layout-sidebar"]}>{sidebar}</div>
      <div className={css["layout-main"]}>{children}</div>
      <div className={css["layout-filters"]}>{filters}</div>
    </div>
  );
}
