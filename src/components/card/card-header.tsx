import { cx } from "@/utils/cx";

import type { Card } from "@/store/services/queries.types";
import { getCardColor } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardIcon } from "../card-icon";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { CardNames } from "./card-names";

type Props = {
  card: Card;
  className?: string;
  titleLinks?: "card" | "modal";
};

export function CardHeader(props: Props) {
  const { card, className, titleLinks } = props;
  const colorCls = getCardColor(card, "background");

  return (
    <header className={cx(css["header"], colorCls, className)}>
      <div className={css["header-row"]}>
        <CardIcon card={card} className={css["header-icon"]} inverted />
        <CardNames card={card} titleLinks={titleLinks} />
      </div>
      <MulticlassIcons
        card={card}
        className={cx(css["header-icon"], css["faction-icons"])}
        inverted
      />
    </header>
  );
}
