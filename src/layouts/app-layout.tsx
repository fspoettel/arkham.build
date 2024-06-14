import clsx from "clsx";
import { useMemo } from "react";

import { Masthead } from "@/components/masthead";
import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./app-layout.module.css";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  closeable: React.ReactNode;
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
      <Masthead className={css["header"]} />
      <section className={css["sidebar"]}>{sidebar}</section>
      <section className={css["main"]}>{children}</section>
      <nav className={css["closeable"]} data-state={open ? "open" : "closed"}>
        {closeable}
      </nav>
    </div>
  );
}
