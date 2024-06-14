import clsx from "clsx";
import { Fragment } from "react";

import { Card } from "@/store/graphql/types";
import { SKILL_KEYS } from "@/utils/constants";
import { range } from "@/utils/range";

import css from "./skill-icons.module.css";

import { CostIcon } from "./icons/cost-icon";
import { SkillIcon } from "./icons/skill-icon";
import { SkillIconFancy } from "./icons/skill-icon-fancy";

type Props = {
  asEnemy?: boolean;
  asInvestigator?: boolean;
  card: Card;
  className?: string;
  fancy?: boolean;
  iconClassName?: string;
};

export function SkillIcons({
  asEnemy,
  asInvestigator,
  className,
  card,
  fancy,
  iconClassName,
}: Props) {
  if (!asInvestigator && card.type_code === "investigator") return null;

  const Icon = fancy ? SkillIconFancy : SkillIcon;

  const entries: [string, number | undefined][] = asEnemy
    ? [
        ["combat", card.enemy_fight],
        [
          card.health_per_investigator ? "per_investigator" : "health",
          card.health,
        ],
        ["agility", card.enemy_evade],
      ]
    : SKILL_KEYS.reduce(
        (acc, key) => {
          if (card[`skill_${key}`])
            acc.push([key, card[`skill_${key}`] as number]);
          return acc;
        },
        [] as [string, number][],
      );

  if (!entries.length) return null;

  const isNumbered = asInvestigator || asEnemy;

  return (
    <ol className={clsx(css["skills"], className)}>
      {entries.map(([key, val]) => {
        return (
          <Fragment key={key}>
            {isNumbered && (
              <li
                className={clsx(css["skill_investigator"], iconClassName)}
                key={key}
              >
                <CostIcon className={css["skill-cost"]} cost={val} />
                <Icon className={css["skill-icon"]} skill={key} />
              </li>
            )}
            {!isNumbered &&
              range(0, val ?? 0).map((i) => (
                <li className={iconClassName} key={key + i}>
                  <Icon skill={key} />
                </li>
              ))}
          </Fragment>
        );
      })}
    </ol>
  );
}
