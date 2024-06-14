import { Card as CardSchema } from "@/store/graphql/types";
import css from "./card.module.css";
import clsx from "clsx";
import { CardIcon } from "./card-icon";
import { SkillIcons } from "../ui/skill-icons";

type Props = {
  card: CardSchema;
};

export function Card({ card }: Props) {
  if (!card) return null;

  return (
    <figure
      className={clsx(
        css["card"],
        css[`${card.faction_code}`],
        card.faction2_code && css["multiclass"],
      )}
    >
      <CardIcon
        className={clsx(css["card-icon"], `color-${card.faction_code}`)}
        card={card}
      />

      <figcaption>
        <h4 className={clsx(css["card-name"], `color-${card.faction_code}`)}>
          {card.real_name}
        </h4>
        <div className={css["card-meta"]}>
          <SkillIcons card={card} />
          {card.real_subname && (
            <h5 className={css["card-subname"]}>{card.real_subname}</h5>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
