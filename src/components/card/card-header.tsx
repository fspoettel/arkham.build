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

export function CardHeader(props: Props) {
  const colorCls = getCardColor(props.card, "background");

  return (
    <header className={clsx(css["header"], colorCls, props.className)}>
      <div className={css["header-row"]}>
        <CardIcon card={props.card} className={css["header-icon"]} inverted />
        <CardNames
          code={props.card.code}
          isUnique={props.card.is_unique}
          linked={props.linked}
          name={props.card.real_name}
          parallel={props.card.parallel}
          subname={props.card.real_subname}
        />
      </div>
      <MulticlassIcons
        card={props.card}
        className={clsx(css["header-icon"], css["faction-icons"])}
        inverted
      />
    </header>
  );
}
