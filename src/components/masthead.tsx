import clsx from "clsx";
import { Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

import css from "./masthead.module.css";

import { Button } from "./ui/button";

type Props = {
  className?: string;
  children?: React.ReactNode;
  slotRight?: React.ReactNode;
};

export function Masthead({ children, className, slotRight }: Props) {
  const [location] = useLocation();
  return (
    <header className={clsx(className, css["masthead"])}>
      <div className={css["left"]}>
        <Link className={css["logo"]} href="/" data-testid="masthead-logo">
          <img alt="Arkham.build logo" src="/logo.svg" />
        </Link>
        {children}
      </div>
      <nav className={css["right"]}>
        {slotRight}
        {location !== "/settings" && (
          <Link asChild href="/settings">
            <Button
              as="a"
              className={css["settings"]}
              data-testid="masthead-settings"
              variant="bare"
              tooltip="Go to settings"
            >
              <Settings />
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
