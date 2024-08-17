import { cx } from "@/utils/cx";

import type { CardWithRelations, ResolvedCard } from "@/store/lib/types";
import { sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { CARDS_WITH_LOCAL_IMAGES } from "@/utils/constants";
import { CardDetails } from "./card-details";
import { CardHeader } from "./card-header";
import { CardIcons } from "./card-icons";
import { CardMeta } from "./card-meta";
import { CardScan } from "./card-scan";
import { CardTabooText } from "./card-taboo-text";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

type Props = {
  className?: string;
  resolvedCard: CardWithRelations | ResolvedCard;
  linked?: boolean;
  size: "compact" | "tooltip" | "full";
} & React.HTMLAttributes<HTMLDivElement>;

export function CardFace(props: Props) {
  const { className, resolvedCard, linked, size, ...rest } = props;

  const { card } = resolvedCard;
  const isSideways = sideways(card);

  const showImage =
    (card.imageurl || CARDS_WITH_LOCAL_IMAGES[card.code]) &&
    (size === "full" || card.type_code !== "story");

  return (
    <article
      className={cx(
        css["card"],
        isSideways && css["sideways"],
        showImage && css["has-image"],
        css[size],
        className,
      )}
      data-testid="card-face"
      {...rest}
    >
      <CardHeader card={card} linked={linked} />

      <div className={css["pre"]}>
        <CardDetails resolvedCard={resolvedCard} />
        <CardIcons card={card} />
      </div>

      <div className={css["content"]}>
        <CardText
          flavor={card.real_flavor}
          size={size}
          text={card.real_text}
          typeCode={card.type_code}
          victory={card.victory}
        />
        <CardTabooText card={card} />
        <CardMeta resolvedCard={resolvedCard} size={size} />
      </div>

      {showImage &&
        (size === "full" ? (
          <CardScan
            className={css["image"]}
            code={card.code}
            sideways={isSideways}
          />
        ) : (
          <div className={css["image"]}>
            <CardThumbnail card={card} />
          </div>
        ))}
    </article>
  );
}
