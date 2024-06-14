import css from "./card.module.css";

import { getCardColor } from "@/utils/card-utils";
import { CardIcon } from "./card-icon";
import { CardNames } from "./card-names";
import clsx from "clsx";
import { CardDetails } from "./card-details";
import { CardText } from "./card-text";
import { CardFlavor } from "./card-flavor";
import { CardImage } from "./card-image";
import { CardIcons } from "./card-icons";
import { CardMeta } from "./card-meta";
import { CardResolved } from "@/store/selectors/card-detail";
import { CardThumbnail } from "./card-thumbnail";
import { MulticlassIcons } from "../ui/icons/multiclass-icons";

type Props = {
  resolvedCard: CardResolved;
  compact?: boolean;
  linked?: boolean;
  reversed?: boolean;
};

export function Card({ resolvedCard, compact, linked, reversed }: Props) {
  const { card, type, subtype, pack, encounterSet } = resolvedCard;

  const colorCls = getCardColor(card, "background");
  const borderCls = getCardColor(card, "border");

  const isSideways = resolvedCard.type
    ? ["investigator", "act", "agenda"].includes(type.code)
    : false;

  const front = (
    <article
      className={clsx(
        css["card"],
        isSideways && css["sideways"],
        compact && css["compact"],
        borderCls,
      )}
    >
      <header className={clsx(css["header"], colorCls)}>
        <div className={css["header-row"]}>
          <CardIcon inverted card={card} />
          <CardNames
            code={card.code}
            isUnique={card.is_unique}
            name={card.real_name}
            linked={linked}
            parallel={card.parallel}
            subname={card.real_subname}
          />
        </div>
        <MulticlassIcons
          className={css["faction-icons"]}
          card={card}
          inverted
        />
      </header>

      <div className={css["container"]}>
        <CardDetails
          clues={card.clues}
          cluesFixed={card.clues_fixed}
          doom={card.doom}
          shroud={card.shroud}
          slot={card.real_slot}
          subtype={subtype}
          traits={card.real_traits}
          type={type}
        />
        <CardIcons card={card} />
        <CardText text={card.real_text} victory={card.victory} />
        {!compact && <CardFlavor flavor={card.real_flavor} />}
        {!compact && <CardMeta resolvedCard={resolvedCard} />}
      </div>
      {card.imageurl &&
        (compact ? (
          <div className={css["image"]}>
            <CardThumbnail card={card} />
          </div>
        ) : (
          <CardImage className={css["image"]} imageUrl={card.imageurl} />
        ))}
    </article>
  );

  const back = !compact && !card.back_link_id && card.double_sided && (
    <article
      className={clsx(css["card"], isSideways && css["sideways"], borderCls)}
    >
      {card.real_back_name && (
        <header className={clsx(css["header"], colorCls)}>
          <CardNames name={card.real_back_name} code={card.code} />
        </header>
      )}
      <div className={css["container"]}>
        <CardText text={card.real_back_text} />
        <CardFlavor flavor={card.real_back_flavor} />
        {card.back_illustrator &&
          card.back_illustrator !== card.illustrator && (
            <CardMeta resolvedCard={resolvedCard} isBack />
          )}
      </div>
      {card.backimageurl && (
        <CardImage className={css["image"]} imageUrl={card.backimageurl} />
      )}
    </article>
  );

  return (
    <>
      {reversed ? (
        <>
          {back}
          {front}
        </>
      ) : (
        <>
          {front}
          {back}
        </>
      )}
    </>
  );
}
