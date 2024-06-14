import clsx from "clsx";

import type { CardWithRelations } from "@/store/selectors/card-view";
import { getCardColor, sideways } from "@/utils/card-utils";

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
  resolvedCard: CardWithRelations;
  linked?: boolean;
  size: "compact" | "tooltip" | "full";
};

export function CardFront({ className, resolvedCard, linked, size }: Props) {
  const { card } = resolvedCard;

  const colorCls = getCardColor(card, "background");

  const isSideways = sideways(card);

  return (
    <article
      className={clsx(
        css["card"],
        sideways(card) && css["sideways"],
        card.imageurl && css["has-image"],
        css[size],
        className,
      )}
    >
      <CardHeader card={card} linked={linked} className={colorCls} />

      <div className={css["details"]}>
        <CardDetails resolvedCard={resolvedCard} />
        <CardIcons card={card} />
      </div>

      <div className={css["container"]}>
        <CardText
          flavor={card.real_flavor}
          size={size}
          text={card.real_text}
          tabooXp={card.taboo_xp}
          tabooText={card.real_taboo_text_change}
          typeCode={card.type_code}
          victory={card.victory}
        />
        <CardMeta resolvedCard={resolvedCard} size={size} />
      </div>

      {card.imageurl &&
        (size === "full" ? (
          <CardImage
            className={css["image"]}
            imageUrl={card.imageurl}
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
