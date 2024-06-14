import { Card } from "@/store/graphql/types";
import { SkillIcons } from "../ui/skill-icons";
import { CardDamage } from "./card-damage";
import { CardHealth } from "./card-health";

import css from "./card-icons.module.css";

type Props = {
  card: Card;
};

export function CardIcons({ card }: Props) {
  return (
    <div className={css["icons"]}>
      <SkillIcons
        asInvestigator={card.type_code === "investigator"}
        className={css["icons-skills"]}
        iconClassName={css["icons-skill"]}
        card={card}
        fancy
      />

      {card.type_code !== "enemy" && (card.health || card.sanity) && (
        <CardHealth health={card.health} sanity={card.sanity} />
      )}

      {card.type_code === "enemy" && (
        <>
          <SkillIcons
            asEnemy
            className={css["icons-skills"]}
            iconClassName={css["icons-skill"]}
            card={card}
            fancy
          />
          <CardDamage damage={card.enemy_damage} horror={card.enemy_horror} />
        </>
      )}
    </div>
  );
}
