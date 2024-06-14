import clsx from "clsx";
import type { ReactNode } from "react";

import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./app-layout.module.css";

import { Masthead } from "../masthead";

type Props = {
  children: ReactNode;
  centerScroller?: boolean;
  sidebar?: ReactNode;
  closeable?: ReactNode;
  title: string;
};

export function AppLayout({ children, sidebar, closeable, title }: Props) {
  const open = useStore((state) => state.ui.sidebarOpen);

  useDocumentTitle(title);

  return (
    <div
      className={clsx(
        css["layout"],
        !!sidebar && css["has-sidebar"],
        !!closeable && css["has-closeable"],
      )}
    >
      <Masthead className={css["layout-header"]} />
      {sidebar && (
        <section className={css["layout-sidebar"]}>{sidebar}</section>
      )}
      <section className={css["layout-main"]}>{children}</section>
      {closeable && (
        <nav
          className={css["layout-closeable"]}
          data-state={open ? "open" : "closed"}
        >
          {closeable}
        </nav>
      )}
    </div>
  );
}
