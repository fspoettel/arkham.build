import clsx from "clsx";
import { ReactNode } from "react";

import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./app_layout.module.css";

type Props = {
  children: ReactNode;
  centerClassName?: string;
  filters?: ReactNode;
  sidebar: ReactNode;
  title: string;
};

export function AppLayout({
  centerClassName,
  children,
  filters,
  sidebar,
  title,
}: Props) {
  useDocumentTitle(title);

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
