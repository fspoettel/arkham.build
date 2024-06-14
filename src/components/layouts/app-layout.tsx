import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./app-layout.module.css";

import { Scroller } from "../ui/scroll-area";
import { Masthead } from "./masthead";

type Props = {
  children: ReactNode;
  centerScroller?: boolean;
  filters?: ReactNode;
  sidebar: ReactNode;
  title: string;
};

export function AppLayout({
  children,
  centerScroller,
  filters,
  sidebar,
  title,
}: Props) {
  const open = useStore((state) => state.ui.sidebarOpen);

  useDocumentTitle(title);

  const [pathname] = useLocation();

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={css["layout"]}>
      <Masthead className={css["header"]} />
      <section className={css["layout-left"]}>{sidebar}</section>
      <section className={css["layout-main"]}>
        {centerScroller ? (
          <Scroller ref={scrollerRef}>{children}</Scroller>
        ) : (
          children
        )}
      </section>
      {filters && (
        <nav
          data-state={open ? "open" : "closed"}
          className={css["layout-right"]}
        >
          <Scroller>{filters}</Scroller>
        </nav>
      )}
    </div>
  );
}
