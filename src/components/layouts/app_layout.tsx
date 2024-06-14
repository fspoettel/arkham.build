import { ReactNode } from "react";
import css from "./app_layout.module.css";

type Props = {
  children: ReactNode;
  filters: ReactNode;
  sidebar: ReactNode;
};

export function AppLayout({ children, filters, sidebar }: Props) {
  return (
    <div className={css["layout"]}>
      <section className={css["layout-sidebar"]}>{sidebar}</section>
      <section className={css["layout-main"]}>{children}</section>
      <nav className={css["layout-filters"]}>{filters}</nav>
    </div>
  );
}
