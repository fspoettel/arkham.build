import { cx } from "@/utils/cx";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CardTypeFilter } from "@/components/filters/card-type-filter";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/utils/use-media";

import { Filter } from "lucide-react";
import { useStore } from "../store";
import css from "./list-layout.module.css";

type Props = {
  children: (props: {
    slotRight?: React.ReactNode;
    slotLeft?: React.ReactNode;
  }) => React.ReactNode;
  className?: string;
  filters: React.ReactNode;
  mastheadContent?: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarWidthMax: string;
};

export function ListLayout(props: Props) {
  const {
    children,
    className,
    filters,
    mastheadContent,
    sidebar,
    sidebarWidthMax,
  } = props;

  const [floatingFiltersOpen, setFloatingFiltersOpen] = useState(false);

  const sidebarOpen = useStore((state) => state.ui.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);

  const filtersRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const onContentClick = useCallback(
    (evt: React.PointerEvent) => {
      if (!floatingFiltersOpen && !sidebarOpen) return;
      evt.preventDefault();
      setFloatingFiltersOpen(false);
      setSidebarOpen(false);
    },
    [floatingFiltersOpen, sidebarOpen, setSidebarOpen],
  );

  const preventBubble = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  const layoutWithSidebar = useMedia("(min-width: 52rem)");
  const layoutWithFilters = useMedia("(min-width: 75rem)");

  console.log(layoutWithSidebar, "layoutWithSidebar");

  useEffect(() => {
    if (layoutWithSidebar) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [layoutWithSidebar, setSidebarOpen]);

  useEffect(() => {
    if (layoutWithFilters) setFloatingFiltersOpen(false);
  }, [layoutWithFilters]);

  return (
    <div
      className={cx(
        css["layout"],
        floatingFiltersOpen && css["filters-open"],
        sidebarOpen && !layoutWithSidebar && css["floating-sidebar-open"],
        layoutWithSidebar && !sidebarOpen && css["collapsed-sidebar"],
        "fade-in",
        className,
      )}
      onPointerDown={onContentClick}
      style={{ "--sidebar-width-max": sidebarWidthMax } as React.CSSProperties}
    >
      <Masthead className={css["header"]} slotRight={<CardTypeFilter />}>
        {mastheadContent}
      </Masthead>
      <div
        className={css["sidebar"]}
        data-state={sidebarOpen ? "open" : "closed"}
        onPointerDown={sidebarOpen ? preventBubble : undefined}
        ref={sidebarRef}
      >
        {sidebar}
      </div>
      <div
        className={css["content"]}
        onPointerDown={
          sidebarOpen || floatingFiltersOpen ? onContentClick : undefined
        }
      >
        {children({
          slotLeft: !sidebarOpen && (
            <Button
              className={css["toggle-sidebar"]}
              onClick={() => setSidebarOpen(true)}
            >
              <i className="icon-deck" />
            </Button>
          ),
          slotRight: (
            <Button
              className={css["toggle-filters"]}
              onClick={() => setFloatingFiltersOpen(true)}
            >
              <Filter />
            </Button>
          ),
        })}
      </div>
      <nav
        className={css["filters"]}
        data-state={floatingFiltersOpen ? "open" : "closed"}
        onPointerDown={floatingFiltersOpen ? preventBubble : undefined}
        ref={filtersRef}
      >
        {filters}
      </nav>
    </div>
  );
}
