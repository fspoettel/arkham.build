import { Card } from "@/store/graphql/types";
import css from "./skill-icons.module.css";
import { SKILL_KEYS } from "@/store/constants";
import { range } from "@/utils/range";
import { SkillIcon } from "./skill-icon";
import { Fragment } from "react";

type Props = {
  card: Card;
};

export function SkillIcons({ card }: Props) {
  if (card.type_code === "investigator") return null;

  return (
    <ol className={css["skill-icons"]}>
      {SKILL_KEYS.map((key) => {
        const skillValue = card[`skill_${key}`];
        if (!skillValue) return null;
        return (
          <Fragment key={key}>
            {range(0, skillValue).map((i) => (
              <li key={key + i}>
                <SkillIcon skill={key} />
              </li>
            ))}
          </Fragment>
        );
      })}
    </ol>
  );
}
