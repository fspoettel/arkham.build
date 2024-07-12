import { cx } from "@/utils/cx";
import { Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

import css from "./masthead.module.css";

import { Button } from "./ui/button";

type Props = {
  className?: string;
  children?: React.ReactNode;
  slotRight?: React.ReactNode;
};

export function Masthead(props: Props) {
  const [location] = useLocation();
  return (
    <header className={cx(props.className, css["masthead"])}>
      <div className={css["left"]}>
        <Link className={css["logo"]} href="/" data-testid="masthead-logo">
          <img alt="Arkham.build logo" src="/logo.svg" />
        </Link>
        {props.children}
      </div>
      <nav className={css["right"]}>
        {props.slotRight}
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
