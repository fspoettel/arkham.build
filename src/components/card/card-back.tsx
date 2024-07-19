import { cx } from "@/utils/cx";

import type { ResolvedCard } from "@/store/lib/types";
import type { Card as CardType } from "@/store/services/queries.types";
import { sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { useMemo } from "react";
import { CardHeader } from "./card-header";
import { CardMetaBack } from "./card-meta";
import { CardScan } from "./card-scan";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

type Props = {
  className?: string;
  card: ResolvedCard["card"];
  size: "compact" | "tooltip" | "full";
} & React.HTMLAttributes<HTMLDivElement>;

export function CardBack(props: Props) {
  const { className, card, size, ...rest } = props;

  const backCard: CardType = useMemo(
    () => ({
      ...card,
      real_name: card.real_back_name ?? `${card.real_name} - Back`,
      real_subname: undefined,
      real_flavor: card.real_back_flavor,
      illustrator: card.back_illustrator,
      real_text: card.real_back_text,
      imageurl: card.backimageurl,
    }),
    [card],
  );

  const isSideways = sideways(card);
  const hasHeader = card.parallel || card.type_code !== "investigator";

  const showImage =
    backCard.imageurl &&
    (size === "full" ||
      (backCard.imageurl !== card.imageurl &&
        backCard.type_code !== "investigator" &&
        backCard.type_code !== "story"));

  const showMeta =
    size === "full" &&
    backCard.illustrator &&
    backCard.illustrator !== card.illustrator;

  return (
    <article
      className={cx(
        css["card"],
        isSideways && css["sideways"],
        css["back"],
        hasHeader && css["back-has-header"],
        showImage && css["has-image"],
        css[size],
        className,
      )}
      data-testid="card-back"
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
        {showMeta && <CardMetaBack illustrator={backCard.illustrator} />}
      </div>

      {showImage &&
        (size === "full" ? (
          <CardScan
            className={css["image"]}
            code={card.code}
            sideways={isSideways}
            suffix="b"
          />
        ) : (
          <div className={css["image"]}>
            <CardThumbnail card={backCard} suffix="b" />
          </div>
        ))}
    </article>
  );
}
