import { GearIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Link } from "wouter";

import css from "./masthead.module.css";

import { Button } from "../ui/button";

export function Masthead({ className }: { className?: string }) {
  return (
    <header className={clsx(className, css["masthead"])}>
      <nav>
        <Link href="settings">
          <Button className={css["header-settings"]} variant="bare" as="a">
            <GearIcon />
          </Button>
        </Link>
      </nav>
    </header>
  );
}
