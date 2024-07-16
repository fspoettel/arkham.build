import { cx } from "@/utils/cx";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CardTypeFilter } from "@/components/filters/card-type-filter";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/utils/use-media";

import { Filter } from "lucide-react";
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

  const [filtersOpen, onToggleFilters] = useState(false);
  const [sidebarOpen, onToggleSidebar] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const onContentClick = useCallback(
    (evt: React.PointerEvent) => {
      if (!filtersOpen && !sidebarOpen) return;
      evt.preventDefault();
      onToggleFilters(false);
      onToggleSidebar(false);
    },
    [filtersOpen, sidebarOpen],
  );

  const preventBubble = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  const sidebarVisible = useMedia("(min-width: 52rem)");
  const filtersVisible = useMedia("(min-width: 75rem)");

  useEffect(() => {
    if (sidebarVisible) onToggleSidebar(false);
  }, [sidebarVisible]);

  useEffect(() => {
    if (filtersVisible) onToggleFilters(false);
  }, [filtersVisible]);

  return (
    <div
      className={cx(
        css["layout"],
        filtersOpen && css["filters-open"],
        sidebarOpen && css["sidebar-open"],
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
        onPointerDown={sidebarOpen || filtersOpen ? onContentClick : undefined}
      >
        {children({
          slotLeft: (
            <Button
              className={css["toggle-sidebar"]}
              onClick={() => onToggleSidebar(true)}
            >
              <i className="icon-deck" />
            </Button>
          ),
          slotRight: (
            <Button
              className={css["toggle-filters"]}
              onClick={() => onToggleFilters(true)}
            >
              <Filter />
            </Button>
          ),
        })}
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
