import clsx from "clsx";
import { Link } from "wouter";
import { Card as CardSchema } from "@/store/graphql/types";
import SvgParallel from "@/assets/icons/parallel.svg?react";
import { CardIcon } from "../card/card-icon";
import { SkillIcons } from "../ui/skill-icons";
import { MulticlassIcons } from "../ui/icons/multiclass-icons";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";
import { CardThumbnail } from "../card/card-thumbnail";

import css from "./list-card.module.css";

type Props = {
  card: CardSchema;
};

export function ListCard({ card }: Props) {
  if (!card) return null;

  const colorCls = getCardColor(card);

  return (
    <figure className={clsx(css["listcard"])}>
      <CardThumbnail card={card} />

      {card.faction_code !== "mythos" && (
        <CardIcon
          className={clsx(css["listcard-icon"], colorCls)}
          card={card}
        />
      )}

      <figcaption>
        <h4 className={clsx(css["listcard-name"], colorCls)}>
          <Link href={`/card/${card.code}`}>{card.real_name}</Link>
        </h4>
        <div className={css["listcard-meta"]}>
          {card.parallel && <SvgParallel />}
          <MulticlassIcons className={css["listcard-multiclass"]} card={card} />
          {hasSkillIcons(card) && <SkillIcons card={card} />}
          {card.real_subname && (
            <h5 className={css["listcard-subname"]}>{card.real_subname}</h5>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
