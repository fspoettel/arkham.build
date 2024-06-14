import {
  DotsHorizontalIcon,
  GearIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { Link, useLocation } from "wouter";

import SvgFilter from "@/assets/icons/filter.svg?react";
import { useStore } from "@/store";

import css from "./masthead.module.css";

import { CardTypeFilter } from "../card-type-filter";
import { Button } from "../ui/button";

export function Masthead({ className }: { className?: string }) {
  const onToggleSearch = useStore((state) => state.toggleSearch);
  const onToggleSidebar = useStore((state) => state.toggleSidebar);

  const [location] = useLocation();
  return (
    <header className={clsx(className, css["masthead"])}>
      <h1>
        <Link href="/">{import.meta.env.VITE_PAGE_NAME}</Link>
      </h1>
      <nav className={css["masthead-nav"]}>
        {location === "/" && (
          <CardTypeFilter className={css["masthead-card-toggle"]} />
        )}
        {location === "/" && (
          <Button
            className={css["masthead-toggle-search"]}
            variant="bare"
            onClick={onToggleSearch}
          >
            <MagnifyingGlassIcon />
          </Button>
        )}
        {location !== "/settings" && (
          <Link href="/settings">
            <Button className={css["masthead-settings"]} variant="bare" as="a">
              <GearIcon />
            </Button>
          </Link>
        )}
        {location !== "/settings" && (
          <Button
            className={css["masthead-toggle-filters"]}
            variant="bare"
            onClick={() => onToggleSidebar()}
          >
            {location === "/" ? <SvgFilter /> : <DotsHorizontalIcon />}
          </Button>
        )}
      </nav>
    </header>
  );
}
