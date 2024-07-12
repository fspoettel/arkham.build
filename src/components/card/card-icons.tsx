import { cx } from "@/utils/cx";

import type { Card } from "@/store/services/queries.types";
import { range } from "@/utils/range";

import css from "./card.module.css";

import { CardHealth } from "../card-health";
import { SkillIcons } from "../skill-icons/skill-icons";
import { SkillIconsEnemy } from "../skill-icons/skill-icons-enemy";
import { SkillIconsInvestigator } from "../skill-icons/skill-icons-investigator";

type Props = {
  card: Card;
  className?: string;
};

export function CardIcons(props: Props) {
  const { card, className } = props;

  return (
    <div className={cx(css["icons"], className)}>
      {card.type_code === "investigator" ? (
        <SkillIconsInvestigator
          card={card}
          className={css["icons-skills"]}
          iconClassName={css["icons-skill"]}
        />
      ) : (
        <SkillIcons
          card={card}
          className={css["icons-skills"]}
          fancy
          iconClassName={css["icons-skill"]}
        />
      )}

      {card.type_code !== "enemy" && (card.health || card.sanity) && (
        <CardHealth health={card.health} sanity={card.sanity} />
      )}

      {card.type_code === "enemy" && (
        <>
          <SkillIconsEnemy
            card={card}
            className={css["icons-skills"]}
            iconClassName={css["icons-skill"]}
          />
          <div className={css["icons-damage"]}>
            {!!card.enemy_damage &&
              range(0, card.enemy_damage).map((i) => (
                <i className="icon-health color-health" key={i} />
              ))}
            {!!card.enemy_horror &&
              range(0, card.enemy_horror).map((i) => (
                <i className="icon-sanity color-sanity" key={i} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
