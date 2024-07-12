import { cx } from "@/utils/cx";

import type { Card } from "@/store/services/queries.types";

import css from "./multiclass-icons.module.css";

import { FactionIcon } from "./faction-icon";

type Props = {
  className?: string;
  card: Pick<Card, "faction_code" | "faction2_code" | "faction3_code">;
  inverted?: boolean;
};

export function MulticlassIcons(props: Props) {
  const { className, card, inverted } = props;
  return (
    <ol className={cx(css["container"], className)}>
      <li>
        <FactionIcon
          className={cx(
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
            className={cx(
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
            className={cx(
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
