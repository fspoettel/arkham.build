import clsx from "clsx";

import { Card as ICard } from "@/store/graphql/types";
import { CardResolved } from "@/store/selectors/card-detail";
import { getCardColor, sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardHeader } from "./card-header";
import { CardImage } from "./card-image";
import { CardMetaBack } from "./card-meta";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

export type Props = {
  className?: string;
  card: CardResolved["card"];
  size: "compact" | "tooltip" | "full";
};

/**
 * Card back for cards with a non-unique back.
 */
export function CardBack({ card, size }: Props) {
  const colorCls = getCardColor(card, "background");

  const showBackImage =
    size === "full" ||
    (card.backimageurl &&
      card.backimageurl !== card.imageurl &&
      card.type_code !== "investigator");

  const backCard: ICard = {
    ...card,
    real_name: card.real_back_name ?? `${card.real_name} - Back`,
    real_subname: undefined,
    real_flavor: card.real_back_flavor,
    illustrator: card.back_illustrator,
    real_text: card.real_back_text,
    imageurl: card.backimageurl,
  };

  return (
    <article
      className={clsx(
        css["card"],
        sideways(backCard) && css["sideways"],
        css["back"],
        showBackImage && css["has-image"],
        css[size],
      )}
    >
      {card.type_code !== "investigator" && (
        <CardHeader card={backCard} className={colorCls} />
      )}
      <div className={css["container"]}>
        <CardText
          flavor={card.real_back_flavor}
          size={size}
          text={card.real_back_text}
          typeCode={card.type_code}
        />
        {size === "full" &&
          card.back_illustrator &&
          card.back_illustrator !== card.illustrator && (
            <CardMetaBack illustrator={card.back_illustrator} />
          )}
      </div>

      {backCard.imageurl &&
        showBackImage &&
        (size === "full" ? (
          <CardImage className={css["image"]} imageUrl={backCard.imageurl} />
        ) : (
          <div className={css["image"]}>
            <CardThumbnail card={backCard} />
          </div>
        ))}
    </article>
  );
}
