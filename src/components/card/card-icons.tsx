import { Card } from "@/store/graphql/types";

import css from "./card-icons.module.css";

import { SkillIcons } from "../ui/skill-icons";
import { SkillIconsEnemy } from "../ui/skill-icons-enemy";
import { SkillIconsInvestigator } from "../ui/skill-icons-investigator";
import { CardDamage } from "./card-damage";
import { CardHealth } from "./card-health";

type Props = {
  card: Card;
};

export function CardIcons({ card }: Props) {
  return (
    <div className={css["icons"]}>
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
