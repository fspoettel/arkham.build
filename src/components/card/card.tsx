import clsx from "clsx";

import { Card as ICard } from "@/store/graphql/types";
import { CardResolved } from "@/store/selectors/card-detail";
import { getCardColor, reversed, sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardDetails } from "./card-details";
import { CardHeader } from "./card-header";
import { CardIcons } from "./card-icons";
import { CardImage } from "./card-image";
import { CardMeta, CardMetaBack } from "./card-meta";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

export type Props = {
  className?: string;
  resolvedCard: CardResolved;
  linked?: boolean;
  size?: "compact" | "tooltip" | "full";
};

/**
 * Renders a card with a "simple" back-side that is tracked on the same card object.
 * Cards are available in three sizes:
 *  - `full`: Renders a full card with all metadata.
 *  - `compact`: Renders a card without its backside and with a smaller card image.
 *  - `tooltip`: Renders the card as a tooltip that is shown in card lists.
 * TODO: a lot of the aspects about this (CSS, selectors) should be cleaned up a bit.
 */
export function Card({
  className,
  resolvedCard,
  linked,
  size = "full",
}: Props) {
  const { card } = resolvedCard;

  const colorCls = getCardColor(card, "background");
  const borderCls = getCardColor(card, "border");

  const front = (
    <article
      className={clsx(
        css["card"],
        borderCls,
        sideways(card) && css["sideways"],
        css[size],
        className,
      )}
    >
      <CardHeader card={card} linked={linked} className={colorCls} />

      <div className={css["container"]}>
        <CardDetails resolvedCard={resolvedCard} />
        <CardIcons card={card} />
        <CardText
          flavor={card.real_flavor}
          size={size}
          text={card.real_text}
          typeCode={card.type_code}
          victory={card.victory}
        />
        <CardMeta resolvedCard={resolvedCard} size={size} />
      </div>

      {card.imageurl &&
        (size === "full" ? (
          <CardImage className={css["image"]} imageUrl={card.imageurl} />
        ) : (
          <div className={css["image"]}>
            <CardThumbnail card={card} />
          </div>
        ))}
    </article>
  );

  const showBack =
    size !== "compact" && card.double_sided && !card.back_link_id;

  const showBackImage =
    size === "full" ||
    (card.backimageurl &&
      card.backimageurl !== card.imageurl &&
      card.type_code !== "investigator");

  const backCard: ICard | undefined = showBack
    ? {
        ...card,
        real_name: card.real_back_name ?? `${card.real_name} - Back`,
        real_subname: undefined,
        real_flavor: card.real_back_flavor,
        illustrator: card.back_illustrator,
        real_text: card.real_back_text,
        imageurl: card.backimageurl,
      }
    : undefined;

  const back = backCard && (
    <article
      className={clsx(
        css["card"],
        sideways(backCard) && css["sideways"],
        css["back"],
        showBackImage && css["has-image"],
        css[size],
        borderCls,
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

  return reversed(card) ? (
    <>
      {back}
      {front}
    </>
  ) : (
    <>
      {front}
      {back}
    </>
  );
}
