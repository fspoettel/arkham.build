import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";

import { CardList } from "@/components/card-list/card-list";
import { CardTypeFilter } from "@/components/filters/card-type-filter";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { useMedia } from "@/utils/use-media";

import css from "./list-layout.module.css";

type Props = {
  filters: React.ReactNode;
  mastheadContent?: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarWidthMax: string;
};

export function ListLayout({
  filters,
  mastheadContent,
  sidebar,
  sidebarWidthMax,
}: Props) {
  const filtersRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const filtersOpen = useStore((state) => state.ui.filtersOpen);
  const sidebarOpen = useStore((state) => state.ui.sidebarOpen);

  const onToggleFilters = useStore((state) => state.toggleFilters);
  const onToggleSidebar = useStore((state) => state.toggleSidebar);

  const onContentClick = useCallback(() => {
    onToggleFilters(false);
    onToggleSidebar(false);
  }, [onToggleFilters, onToggleSidebar]);

  const preventBubble = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  const sidebarVisible = useMedia("(min-width: 52rem)");
  const filtersVisible = useMedia("(min-width: 75rem)");

  useEffect(() => {
    if (sidebarVisible) onToggleSidebar(false);
  }, [sidebarVisible, onToggleSidebar]);

  useEffect(() => {
    if (filtersVisible) onToggleFilters(false);
  }, [filtersVisible, onToggleFilters]);

  return (
    <div
      className={clsx(
        css["layout"],
        filtersOpen && css["filters-open"],
        sidebarOpen && css["sidebar-open"],
        "fade-in",
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
        onClick={sidebarOpen || filtersOpen ? onContentClick : undefined}
      >
        <CardList
          slotLeft={
            <Button
              className={css["toggle-sidebar"]}
              onClick={() => onToggleSidebar(true)}
              size="sm"
            >
              <i className="icon-deck" />
            </Button>
          }
          slotRight={
            <Button
              className={css["toggle-filters"]}
              onClick={() => onToggleFilters(true)}
              size="sm"
            >
              <i className="icon-filter" />
            </Button>
          }
        />
      </div>
      <nav
        className={css["filters"]}
        data-state={filtersOpen ? "open" : "closed"}
        onPointerDown={filtersOpen ? preventBubble : undefined}
        ref={filtersRef}
      >
        {filters}
      </nav>
    </div>
  );
}
