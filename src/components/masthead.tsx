import { cx } from "@/utils/cx";
import { SettingsIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "../assets/icons/logo.svg?react";
import { HelpMenu } from "./help-menu";
import css from "./masthead.module.css";
import { SyncStatus } from "./sync-status";
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
        <Link className={css["logo"]} href="~/" data-testid="masthead-logo">
          <Logo />
        </Link>
        {props.children}
      </div>
      <nav className={css["right"]}>
        {props.slotRight}
        {location !== "/settings" && (
          <>
            <SyncStatus />
            <Link asChild href="~/settings">
              <Button
                as="a"
                className={css["settings"]}
                data-testid="masthead-settings"
                variant="bare"
                tooltip="Go to settings"
              >
                <SettingsIcon />
              </Button>
            </Link>
          </>
        )}
        <HelpMenu />
      </nav>
    </header>
  );
}
