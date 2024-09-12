import { cx } from "@/utils/cx";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";

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

  const sidebarOpen = useStore((state) => state.ui.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);

  const filtersOpen = useStore((state) => state.ui.filtersOpen);
  const setFiltersOpen = useStore((state) => state.setFiltersOpen);

  const floatingSidebar = useMedia("(max-width: 52rem)");
  const floatingFilters = useMedia("(max-width: 75rem)");

  const filtersRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const onContentClick = useCallback(
    (evt: React.PointerEvent) => {
      if (!floatingFilters || (!filtersOpen && !sidebarOpen)) return;
      evt.preventDefault();
      setFiltersOpen(false);
      setSidebarOpen(false);
    },
    [filtersOpen, sidebarOpen, setSidebarOpen, setFiltersOpen, floatingFilters],
  );

  const preventBubble = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    setSidebarOpen(!floatingSidebar);
  }, [floatingSidebar, setSidebarOpen]);

  useEffect(() => {
    setFiltersOpen(!floatingFilters);
  }, [floatingFilters, setFiltersOpen]);

  return (
    <div
      className={cx(css["layout"], "fade-in", className)}
      onPointerDown={onContentClick}
      style={{ "--sidebar-width-max": sidebarWidthMax } as React.CSSProperties}
    >
      <Masthead className={css["header"]} slotRight={<CardTypeFilter />}>
        {mastheadContent}
      </Masthead>
      <div
        className={cx(css["sidebar"], floatingSidebar && css["floating"])}
        data-state={sidebarOpen ? "open" : "closed"}
        onPointerDown={sidebarOpen ? preventBubble : undefined}
        ref={sidebarRef}
      >
        {sidebar}
      </div>
      <div
        className={cx(
          css["content"],
          (floatingSidebar || !sidebarOpen) && css["collapsed-sidebar"],
          (floatingFilters || !filtersOpen) && css["collapsed-filters"],
          ((floatingSidebar && sidebarOpen) ||
            (floatingFilters && filtersOpen)) &&
            css["floating-menu-open"],
        )}
        onPointerDown={onContentClick}
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
              onClick={() => setFiltersOpen(true)}
            >
              <Filter />
            </Button>
          ),
        })}
      </div>
      <nav
        className={cx(css["filters"], floatingFilters && css["floating"])}
        data-state={filtersOpen ? "open" : "closed"}
        onPointerDown={floatingFilters ? preventBubble : undefined}
        ref={filtersRef}
      >
        {filters}
      </nav>
    </div>
  );
}
