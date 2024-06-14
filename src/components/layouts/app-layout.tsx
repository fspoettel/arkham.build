import clsx from "clsx";
import { type ReactNode, useMemo } from "react";

import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./app-layout.module.css";

import { Masthead } from "../masthead";

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
  closeable: ReactNode;
  title: string;
  sidebarWidthMax: string;
};

export function AppLayout({
  children,
  sidebar,
  closeable,
  sidebarWidthMax,
  title,
}: Props) {
  const open = useStore((state) => state.ui.sidebarOpen);

  useDocumentTitle(title);

  const cssVariables = useMemo(
    () => ({
      "--sidebar-width-max": sidebarWidthMax,
    }),
    [sidebarWidthMax],
  );

  return (
    <div
      className={clsx(
        css["layout"],
        !!sidebar && css["has-sidebar"],
        !!closeable && css["has-closeable"],
      )}
      style={cssVariables as React.CSSProperties}
    >
      <Masthead className={css["layout-header"]} />
      <section className={css["layout-sidebar"]}>{sidebar}</section>
      <section className={css["layout-main"]}>{children}</section>
      <nav
        className={css["layout-closeable"]}
        data-state={open ? "open" : "closed"}
      >
        {closeable}
      </nav>
    </div>
  );
}
