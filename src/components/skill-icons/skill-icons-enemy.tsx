import clsx from "clsx";
import { Fragment } from "react";

import type { Card } from "@/store/services/queries.types";

import css from "./skill-icons.module.css";

import { CostIcon } from "../icons/cost-icon";
import { SkillIconFancy } from "../icons/skill-icon-fancy";

type Props = {
  card: Card;
  className?: string;
  iconClassName?: string;
};

export function SkillIconsEnemy({ className, card, iconClassName }: Props) {
  if (card.type_code !== "enemy") return null;

  const entries: [string, number | undefined][] = [
    ["combat", card.enemy_fight],
    ["health", card.health],
    ["agility", card.enemy_evade],
  ];

  return (
    <ol className={clsx(css["skills"], className)}>
      {entries.map(([key, val]) => {
        return (
          <Fragment key={key}>
            <li
              className={clsx(css["skill_numbered"], iconClassName)}
              key={key}
            >
              <CostIcon className={css["skill-cost"]} cost={val} />
              {key === "health" ? (
                <>
                  {card.health_per_investigator ? (
                    <i className="icon-per_investigator" />
                  ) : (
                    <div className={css["skill-stub"]} />
                  )}
                </>
              ) : (
                <SkillIconFancy className={css["skill-icon"]} skill={key} />
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
