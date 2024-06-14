import { ReactNode } from "react";
import css from "./app_layout.module.css";

type Props = {
  children: ReactNode;
  filters: ReactNode;
  sidebar: ReactNode;
};

export function AppLayout({ children, filters, sidebar }: Props) {
  return (
    <main className={css["layout"]}>
      <div className={css["layout-sidebar"]}>{sidebar}</div>
      <div className={css["layout-main"]}>{children}</div>
      <div className={css["layout-filters"]}>{filters}</div>
    </main>
  );
}
