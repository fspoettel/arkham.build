import clsx from "clsx";
import { useRef } from "react";

import { CardSearch } from "@/components/card-list/card-search";
import { CardTypeFilter } from "@/components/filters/card-type-filter";
import { Footer } from "@/components/footer";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { useClickAway } from "@/utils/use-click-away";

import css from "./list-layout.module.css";

import { CenterLayout } from "./center-layout";

type Props = {
  children: React.ReactNode;
  filters: React.ReactNode;
  mastheadContent?: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarWidthMax: string;
  topContent?: React.ReactNode;
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
        className={css["sidebar"]}
        data-state={sidebarOpen ? "open" : "closed"}
        ref={sidebarRef}
      >
        {sidebar}
      </div>
      <div className={css["content"]}>
        <CenterLayout
          top={
            <>
              {topContent}
              <CardSearch
                slotLeft={
                  <Button
                    className={css["toggle-sidebar"]}
                    onClick={() => onToggleSidebar(true)}
                  >
                    <i className="icon-deck" />
                  </Button>
                }
                slotRight={
                  <Button
                    className={css["toggle-filters"]}
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
        className={css["filters"]}
        data-state={filtersOpen ? "open" : "closed"}
        ref={filtersRef}
      >
        {filters}
      </nav>
      <footer className={css["footer"]}>
        <Footer />
      </footer>
    </div>
  );
}
