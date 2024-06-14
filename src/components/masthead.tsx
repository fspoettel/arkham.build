import clsx from "clsx";
import { Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";

import css from "./masthead.module.css";

import { Button } from "./ui/button";

type Props = {
  className?: string;
  children?: ReactNode;
  slotRight?: ReactNode;
};

export function Masthead({ children, className, slotRight }: Props) {
  const [location] = useLocation();
  return (
    <header className={clsx(className, css["masthead"])}>
      <div className={css["masthead-left"]}>
        <Link className={css["masthead-logo"]} href="~/">
          <img alt="Arkham.build logo" src="/logo.svg" />
        </Link>
        {children}
      </div>
      <nav className={css["masthead-right"]}>
        {slotRight}
        {location !== "/settings" && (
          <Link asChild href="~/settings">
            <Button as="a" className={css["masthead-settings"]} variant="bare">
              <Settings />
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
