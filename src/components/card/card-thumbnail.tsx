import clsx from "clsx";

import { Card } from "@/store/graphql/types";
import { getCardColor } from "@/utils/card-utils";

import css from "./card-thumbnail.module.css";

type Props = {
  card: Card;
  className?: string;
};

export function CardThumbnail({ card, className }: Props) {
  const colorCls = getCardColor(card);

  if (!card.imageurl) return null;

  return (
    <div
      className={clsx(
        css["thumbnail"],
        css[card.type_code],
        card.subtype_code && css[card.subtype_code],
        colorCls,
        className,
      )}
    >
      <img src={card.imageurl} loading="lazy" />
    </div>
  );
}
