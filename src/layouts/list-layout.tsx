import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { MQ_FLOATING_FILTERS, MQ_FLOATING_SIDEBAR } from "@/utils/constants";
import { cx } from "@/utils/cx";
import { useMedia } from "@/utils/use-media";
import { FilterIcon } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
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
  extras?: React.ReactNode;
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
    extras,
    sidebarWidthMax,
  } = props;

  const sidebarOpen = useStore((state) => state.ui.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);

  const filtersOpen = useStore((state) => state.ui.filtersOpen);
  const setFiltersOpen = useStore((state) => state.setFiltersOpen);

  const floatingSidebar = useMedia(MQ_FLOATING_SIDEBAR);
  const floatingFilters = useMedia(MQ_FLOATING_FILTERS);

  const filtersRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const onContentClick = useCallback(
    (evt: React.PointerEvent) => {
      if (filtersOpen && floatingFilters) {
        setFiltersOpen(false);
        evt.preventDefault();
      }

      if (sidebarOpen && floatingSidebar) {
        setSidebarOpen(false);
        evt.preventDefault();
      }
    },
    [
      filtersOpen,
      sidebarOpen,
      setSidebarOpen,
      setFiltersOpen,
      floatingFilters,
      floatingSidebar,
    ],
  );

  const preventBubble = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    setSidebarOpen(!floatingSidebar);

    return () => {
      setSidebarOpen(!floatingSidebar);
    };
  }, [floatingSidebar, setSidebarOpen]);

  useEffect(() => {
    setFiltersOpen(!floatingFilters);

    return () => {
      setFiltersOpen(!floatingFilters);
    };
  }, [floatingFilters, setFiltersOpen]);

  const floatingMenuOpen =
    ((floatingSidebar && sidebarOpen) || (floatingFilters && filtersOpen)) &&
    css["floating-menu-open"];

  return (
    <div
      className={cx(
        css["layout"],
        "fade-in",
        className,
        floatingMenuOpen && css["floating-menu-open"],
      )}
      onPointerDown={onContentClick}
      style={{ "--sidebar-width-max": sidebarWidthMax } as React.CSSProperties}
    >
      <Masthead className={css["header"]}>{mastheadContent}</Masthead>
      <div
        className={cx(
          css["sidebar"],
          css["layout-area"],
          floatingSidebar && css["floating"],
        )}
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
        )}
        onPointerDown={onContentClick}
      >
        {children({
          slotLeft: !sidebarOpen && (
            <Button
              className={css["toggle-sidebar"]}
              onClick={() => setSidebarOpen(true)}
              iconOnly
              size="lg"
            >
              <i className="icon-deck" />
            </Button>
          ),
          slotRight: !filtersOpen && (
            <Button
              className={css["toggle-filters"]}
              onClick={() => setFiltersOpen(true)}
              iconOnly
              size="lg"
            >
              <FilterIcon />
            </Button>
          ),
        })}
      </div>
      <nav
        className={cx(
          css["filters"],
          css["layout-area"],
          floatingFilters && css["floating"],
        )}
        data-state={filtersOpen ? "open" : "closed"}
        onPointerDown={floatingFilters ? preventBubble : undefined}
        ref={filtersRef}
      >
        {filters}
      </nav>
      {!!extras && extras}
    </div>
  );
}
