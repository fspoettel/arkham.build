import { Card as CardSchema } from "@/store/graphql/types";
import css from "./card.module.css";
import clsx from "clsx";
import { CardIcon } from "./card-icon";
import { SkillIcons } from "../ui/skill-icons";
import { getCardColor, hasSkillIcons } from "@/store/utils";
import { MulticlassIcons } from "../ui/multiclass-icons";

type Props = {
  card: CardSchema;
};

export function Card({ card }: Props) {
  if (!card) return null;

  const colorCls = getCardColor(card);

  return (
    <figure className={clsx(css["card"])}>
      {card.imageurl && (
        <div
          className={clsx(
            css["card-image"],
            css[card.type_code],
            card.subtype_code && css[card.subtype_code],
            colorCls,
          )}
        >
          <img src={card.imageurl} loading="lazy" />
        </div>
      )}

      <CardIcon className={clsx(css["card-icon"], colorCls)} card={card} />

      <figcaption>
        <h4 className={clsx(css["card-name"], colorCls)}>{card.real_name}</h4>
        <div className={css["card-meta"]}>
          <MulticlassIcons className={css["card-multiclass"]} card={card} />
          {hasSkillIcons(card) && <SkillIcons card={card} />}

          {card.real_subname && (
            <h5 className={css["card-subname"]}>{card.real_subname}</h5>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
