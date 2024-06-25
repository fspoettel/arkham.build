import clsx from "clsx";

import type { Card } from "@/store/services/queries.types";

import css from "./multiclass-icons.module.css";

import { FactionIcon } from "./faction-icon";

type Props = {
  className?: string;
  card: Pick<Card, "faction_code" | "faction2_code" | "faction3_code">;
  inverted?: boolean;
};

export function MulticlassIcons({ className, card, inverted }: Props) {
  return (
    <ol className={clsx(css["container"], className)}>
      <li>
        <FactionIcon
          className={clsx(
            css["icon"],
            css[card.faction_code],
            inverted ? undefined : `color-${card.faction_code}`,
          )}
          code={card.faction_code}
        />
      </li>
      {card.faction2_code && (
        <li>
          <FactionIcon
            className={clsx(
              css["icon"],
              css[card.faction2_code],
              inverted ? undefined : `color-${card.faction2_code}`,
            )}
            code={card.faction2_code}
          />
        </li>
      )}
      {card.faction3_code && (
        <li>
          <FactionIcon
            className={clsx(
              css["icon"],
              css[card.faction3_code],
              inverted ? undefined : `color-${card.faction3_code}`,
            )}
            code={card.faction3_code}
          />
        </li>
      )}
    </ol>
  );
}
