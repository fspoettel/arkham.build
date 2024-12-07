import { cx } from "@/utils/cx";
import {
  BarChart3Icon,
  EllipsisIcon,
  InfoIcon,
  SettingsIcon,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "../assets/icons/logo.svg?react";
import css from "./masthead.module.css";
import { SyncStatus } from "./sync-status";
import { Button } from "./ui/button";
import { DropdownMenu } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
            <Popover>
              <PopoverTrigger asChild>
                <Button tooltip="More actions" variant="bare">
                  <EllipsisIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <DropdownMenu>
                  <Link asChild href="~/about">
                    <Button
                      as="a"
                      className={css["about"]}
                      data-testid="masthead-about"
                      variant="bare"
                      size="full"
                    >
                      <InfoIcon /> About this site
                    </Button>
                  </Link>
                  <Link asChild href="~/collection-stats">
                    <Button as="a" variant="bare" size="full">
                      <BarChart3Icon /> Collection stats
                    </Button>
                  </Link>
                </DropdownMenu>
              </PopoverContent>
            </Popover>
          </>
        )}
      </nav>
    </header>
  );
}
