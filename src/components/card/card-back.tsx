import clsx from "clsx";

import type { ResolvedCard } from "@/store/lib/types";
import type { Card as CardType } from "@/store/services/types";
import { sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardHeader } from "./card-header";
import { CardImage } from "./card-image";
import { CardMetaBack } from "./card-meta";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

export type Props = {
  className?: string;
  forceShowHeader?: boolean;
  card: ResolvedCard["card"];
  size: "compact" | "tooltip" | "full";
};

/**
 * Card back for cards with a non-unique back.
 */
export function CardBack({ card, forceShowHeader, size }: Props) {
  const showBackImage =
    size === "full" ||
    (card.backimageurl &&
      card.backimageurl !== card.imageurl &&
      card.type_code !== "investigator" &&
      card.type_code !== "story");

  const backCard: CardType = {
    ...card,
    real_name: card.real_back_name ?? `${card.real_name} - Back`,
    real_subname: undefined,
    real_flavor: card.real_back_flavor,
    illustrator: card.back_illustrator,
    real_text: card.real_back_text,
    imageurl: card.backimageurl,
  };

  const isSideways = sideways(card);

  const hasHeader = forceShowHeader || card.type_code !== "investigator";

  return (
    <article
      className={clsx(
        css["card"],
        sideways(backCard) && css["sideways"],
        css["back"],
        hasHeader && css["back-has-header"],
        showBackImage && css["has-image"],
        css[size],
      )}
    >
      {hasHeader && <CardHeader card={backCard} />}
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
          <CardImage
            className={css["image"]}
            code={`${card.code}b`}
            sideways={isSideways}
          />
        ) : (
          <div className={css["image"]}>
            <CardThumbnail card={backCard} />
          </div>
        ))}
    </article>
  );
}
