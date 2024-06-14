import { ReactNode } from "react";
import css from "./app_layout.module.css";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  centerClassName?: string;
  filters?: ReactNode;
  sidebar: ReactNode;
};

export function AppLayout({
  centerClassName,
  children,
  filters,
  sidebar,
}: Props) {
  return (
    <main className={css["layout"]}>
      <section className={css["layout-sidebar"]}>{sidebar}</section>
      <section className={clsx(css["layout-main"], centerClassName)}>
        {children}
      </section>
      {filters && <nav className={css["layout-filters"]}>{filters}</nav>}
    </main>
  );
}
