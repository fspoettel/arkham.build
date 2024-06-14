import { Card } from "@/store/graphql/types";
import { FactionIcon } from "./faction-icon";

import css from "./multiclass-icons.module.css";
import clsx from "clsx";

type Props = {
  className?: string;
  card: Card;
};

export function MulticlassIcons({ className, card }: Props) {
  if (!card.faction2_code) return null;

  return (
    <ol className={clsx(css["container"], className)}>
      <li>
        <FactionIcon
          className={`color-${card.faction_code}`}
          code={card.faction_code}
        />
      </li>
      {card.faction2_code && (
        <li>
          <FactionIcon
            className={`color-${card.faction2_code}`}
            code={card.faction2_code}
          />
        </li>
      )}
      {card.faction3_code && (
        <li>
          <FactionIcon
            className={`color-${card.faction3_code}`}
            code={card.faction3_code}
          />
        </li>
      )}
    </ol>
  );
}
