import clsx from "clsx";

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
  return (
    <div className={clsx(css["icons"], props.className)}>
      {props.card.type_code === "investigator" ? (
        <SkillIconsInvestigator
          card={props.card}
          className={css["icons-skills"]}
          iconClassName={css["icons-skill"]}
        />
      ) : (
        <SkillIcons
          card={props.card}
          className={css["icons-skills"]}
          fancy
          iconClassName={css["icons-skill"]}
        />
      )}

      {props.card.type_code !== "enemy" &&
        (props.card.health || props.card.sanity) && (
          <CardHealth health={props.card.health} sanity={props.card.sanity} />
        )}

      {props.card.type_code === "enemy" && (
        <>
          <SkillIconsEnemy
            card={props.card}
            className={css["icons-skills"]}
            iconClassName={css["icons-skill"]}
          />
          <div className={css["icons-damage"]}>
            {!!props.card.enemy_damage &&
              range(0, props.card.enemy_damage).map((i) => (
                <i className="icon-health color-health" key={i} />
              ))}
            {!!props.card.enemy_horror &&
              range(0, props.card.enemy_horror).map((i) => (
                <i className="icon-sanity color-sanity" key={i} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
