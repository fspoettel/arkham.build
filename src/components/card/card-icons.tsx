import clsx from "clsx";

import type { Card } from "@/store/services/types";

import css from "./card-icons.module.css";

import { SkillIcons } from "../skill-icons";
import { SkillIconsEnemy } from "../skill-icons-enemy";
import { SkillIconsInvestigator } from "../skill-icons-investigator";
import { CardDamage } from "./card-damage";
import { CardHealth } from "./card-health";

type Props = {
  card: Card;
  className?: string;
};

export function CardIcons({ card, className }: Props) {
  return (
    <div className={clsx(css["icons"], className)}>
      {card.type_code === "investigator" ? (
        <SkillIconsInvestigator
          className={css["icons-skills"]}
          iconClassName={css["icons-skill"]}
          card={card}
        />
      ) : (
        <SkillIcons
          className={css["icons-skills"]}
          iconClassName={css["icons-skill"]}
          card={card}
          fancy
        />
      )}

      {card.type_code !== "enemy" && (card.health || card.sanity) && (
        <CardHealth health={card.health} sanity={card.sanity} />
      )}

      {card.type_code === "enemy" && (
        <>
          <SkillIconsEnemy
            className={css["icons-skills"]}
            iconClassName={css["icons-skill"]}
            card={card}
          />
          <CardDamage damage={card.enemy_damage} horror={card.enemy_horror} />
        </>
      )}
    </div>
  );
}
