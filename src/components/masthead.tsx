import { GearIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";

import css from "./masthead.module.css";

import { Button } from "./ui/button";

type Props = {
  className?: string;
  slotNav?: ReactNode;
};

export function Masthead({ className, slotNav }: Props) {
  const [location] = useLocation();
  return (
    <header className={clsx(className, css["masthead"])}>
      <Link className={css["masthead-logo"]} href="~/">
        <img alt="Arkham.build logo" src="/logo.svg" />
      </Link>
      <nav className={css["masthead-nav"]}>
        {slotNav}
        {location !== "/settings" && (
          <Link asChild href="~/settings">
            <Button as="a" className={css["masthead-settings"]} variant="bare">
              <GearIcon />
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
