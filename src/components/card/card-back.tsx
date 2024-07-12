import { cx } from "@/utils/cx";

import type { ResolvedCard } from "@/store/lib/types";
import type { Card as CardType } from "@/store/services/queries.types";
import { sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardHeader } from "./card-header";
import { CardMetaBack } from "./card-meta";
import { CardScan } from "./card-scan";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

type Props = {
  className?: string;
  forceShowHeader?: boolean;
  card: ResolvedCard["card"];
  size: "compact" | "tooltip" | "full";
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Card back for cards with a non-unique back.
 */
export function CardBack(props: Props) {
  const { className, forceShowHeader, card, size, ...rest } = props;

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
      className={cx(
        css["card"],
        sideways(backCard) && css["sideways"],
        css["back"],
        hasHeader && css["back-has-header"],
        showBackImage && css["has-image"],
        css[size],
        className,
      )}
      {...rest}
    >
      {hasHeader && <CardHeader card={backCard} />}
      <div className={css["content"]}>
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
          <CardScan
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
