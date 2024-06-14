import clsx from "clsx";

import type { Card } from "@/store/services/queries.types";
import { getCardColor } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardIcon } from "../card-icon";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { CardNames } from "./card-names";

type Props = {
  card: Card;
  className?: string;
  linked?: boolean;
};

export function CardHeader({ card, className, linked }: Props) {
  const colorCls = getCardColor(card, "background");

  return (
    <header className={clsx(css["header"], colorCls, className)}>
      <div className={css["header-row"]}>
        <CardIcon card={card} className={css["header-icon"]} inverted />
        <CardNames
          code={card.code}
          isUnique={card.is_unique}
          linked={linked}
          name={card.real_name}
          parallel={card.parallel}
          subname={card.real_subname}
        />
      </div>
      <MulticlassIcons
        card={card}
        className={clsx(css["header-icon"], css["faction-icons"])}
        inverted
      />
    </header>
  );
}
