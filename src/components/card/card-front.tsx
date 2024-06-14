import clsx from "clsx";

import type { CardWithRelations, ResolvedCard } from "@/store/lib/types";
import { sideways } from "@/utils/card-utils";

import css from "./card.module.css";

import { CardDetails } from "./card-details";
import { CardHeader } from "./card-header";
import { CardIcons } from "./card-icons";
import { CardImage } from "./card-image";
import { CardMeta } from "./card-meta";
import { CardText } from "./card-text";
import { CardThumbnail } from "./card-thumbnail";

export type Props = {
  className?: string;
  resolvedCard: CardWithRelations | ResolvedCard;
  linked?: boolean;
  size: "compact" | "tooltip" | "full";
};

export function CardFront({ className, resolvedCard, linked, size }: Props) {
  const { card } = resolvedCard;

  const isSideways = sideways(card);

  const showImage =
    card.imageurl && (size === "full" || card.type_code !== "story");

  return (
    <article
      className={clsx(
        css["card"],
        sideways(card) && css["sideways"],
        showImage && css["has-image"],
        css[size],
        className,
      )}
    >
      <CardHeader card={card} linked={linked} />

      <div className={css["details"]}>
        <CardDetails resolvedCard={resolvedCard} />
        <CardIcons card={card} />
      </div>

      <div className={css["container"]}>
        <CardText
          flavor={card.real_flavor}
          size={size}
          tabooText={card.real_taboo_text_change}
          tabooXp={card.taboo_xp}
          text={card.real_text}
          typeCode={card.type_code}
          victory={card.victory}
        />
        <CardMeta resolvedCard={resolvedCard} size={size} />
      </div>

      {showImage &&
        (size === "full" ? (
          <CardImage
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
