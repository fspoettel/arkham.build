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
      <Link href="~/" className={css["masthead-logo"]}>
        <img src="/logo.svg" alt="Arkham.build logo" />
      </Link>
      <nav className={css["masthead-nav"]}>
        {slotNav}
        {location !== "/settings" && (
          <Link href="~/settings" asChild>
            <Button className={css["masthead-settings"]} variant="bare" as="a">
              <GearIcon />
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
