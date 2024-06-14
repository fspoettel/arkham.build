import clsx from "clsx";

import { Card } from "@/store/graphql/types";

import css from "./card-header.module.css";

import { MulticlassIcons } from "../icons/multiclass-icons";
import { CardIcon } from "./card-icon";
import { CardNames } from "./card-names";

type Props = {
  card: Card;
  className?: string;
  linked?: boolean;
};

export function CardHeader({ card, className, linked }: Props) {
  return (
    <header className={clsx(css["header"], className)}>
      <div className={css["header-row"]}>
        <CardIcon className={css["header-icon"]} card={card} inverted />
        <CardNames
          code={card.code}
          isUnique={card.is_unique}
          name={card.real_name}
          linked={linked}
          parallel={card.parallel}
          subname={card.real_subname}
        />
      </div>
      <MulticlassIcons
        className={clsx(css["header-icon"], css["faction-icons"])}
        card={card}
        inverted
      />
    </header>
  );
}
