import clsx from "clsx";
import type { ReactNode } from "react";
import { useRef } from "react";

import { CardSearch } from "@/components/card-list/card-search";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { useClickAway } from "@/utils/use-click-away";

import css from "./list-layout.module.css";

import { CenterLayout } from "../../components/layouts/center-layout";
import { CardTypeFilter } from "../filters/card-type-filter";

type Props = {
  children: ReactNode;
  filters: ReactNode;
  mastheadContent?: ReactNode;
  sidebar: ReactNode;
  sidebarWidthMax: string;
  topContent?: ReactNode;
};

export function ListLayout({
  children,
  filters,
  mastheadContent,
  sidebar,
  sidebarWidthMax,
  topContent,
}: Props) {
  const filtersRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const filtersOpen = useStore((state) => state.ui.filtersOpen);
  const sidebarOpen = useStore((state) => state.ui.sidebarOpen);
  const onToggleFilters = useStore((state) => state.toggleFilters);
  const onToggleSidebar = useStore((state) => state.toggleSidebar);

  useClickAway(sidebarRef, (evt) => {
    if (sidebarOpen) {
      evt.preventDefault();
      onToggleSidebar(false);
    }
  });

  useClickAway(filtersRef, (evt) => {
    if (filtersOpen) {
      evt.preventDefault();
      onToggleFilters(false);
    }
  });

  return (
    <div
      className={clsx(
        css["layout"],
        (filtersOpen || sidebarOpen) && css["overlay-open"],
      )}
      style={{ "--sidebar-width-max": sidebarWidthMax } as React.CSSProperties}
    >
      <Masthead className={css["header"]} slotRight={<CardTypeFilter />}>
        {mastheadContent}
      </Masthead>
      <div
        className={css["layout-sidebar"]}
        data-state={sidebarOpen ? "open" : "closed"}
        ref={sidebarRef}
      >
        {sidebar}
      </div>
      <div className={css["layout-cardlist"]}>
        <CenterLayout
          top={
            <>
              {topContent}
              <CardSearch
                slotLeft={
                  <Button
                    className={css["layout-toggle-sidebar"]}
                    onClick={() => onToggleSidebar(true)}
                  >
                    <i className="icon-deck" />
                  </Button>
                }
                slotRight={
                  <Button
                    className={css["layout-toggle-filters"]}
                    onClick={() => onToggleFilters(true)}
                  >
                    <i className="icon-filter" />
                  </Button>
                }
              />
            </>
          }
        >
          {children}
        </CenterLayout>
      </div>
      <nav
        className={css["layout-filters"]}
        data-state={filtersOpen ? "open" : "closed"}
        ref={filtersRef}
      >
        {filters}
      </nav>
    </div>
  );
}
