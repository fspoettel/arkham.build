import clsx from "clsx";
import type { ReactNode } from "react";

import type { Groupings } from "@/store/lib/deck-grouping";

import css from "./decklist-section.module.css";

type Props = {
  children: ReactNode;
  layout?: "one_column" | "two_column";
  showTitle?: boolean;
  target: keyof Groupings;
  title: string;
};

export function DecklistSection({
  children,
  layout = "one_column",
  showTitle,
  title,
}: Props) {
  return (
    <article className={clsx(css["decklist-section"], css[layout])}>
      <header className={css["decklist-section-header"]}>
        <h3
          className={clsx(
            css["decklist-section-title"],
            !showTitle && "sr-only",
          )}
        >
          {title}
        </h3>
      </header>
      <div className={css["decklist-section-content"]}>{children}</div>
    </article>
  );
}
