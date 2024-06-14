import clsx from "clsx";
import { ReactNode } from "react";

import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./app-layout.module.css";

import { Scroller } from "../ui/scroll-area";
import { Masthead } from "./masthead";

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
    <div className={css["layout"]}>
      <Masthead className={css["header"]} />
      <section className={css["layout-left"]}>{sidebar}</section>
      <section className={clsx(css["layout-main"], centerClassName)}>
        {children}
      </section>
      {filters && (
        <nav className={css["layout-right"]}>
          <Scroller>{filters}</Scroller>
        </nav>
      )}
    </div>
  );
}
