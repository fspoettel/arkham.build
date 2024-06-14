import clsx from "clsx";
import { Card } from "@/store/graphql/types";
import { FactionIcon } from "../ui/faction-icon";
import { LevelIcon } from "../ui/level-icon";
import SvgWeakness from "../icons/weakness";
import css from "./card-icon.module.css";
import { CostIcon } from "../ui/cost-icon";
import { EncounterIcon } from "../ui/encounter-icon";

type Props = {
  card: Card;
  className?: string;
};

export function CardIcon({ card, className }: Props) {
  if (card.subtype_code && card.type_code === "treachery") {
    return (
      <span className={clsx(css["icon_weakness"], className)}>
        <SvgWeakness />
      </span>
    );
  }

  if (card.faction_code === "mythos") {
    return (
      <span className={clsx(css["icon_large"], className)}>
        <EncounterIcon code={card.encounter_code} />
      </span>
    );
  }

  if (card.type_code === "investigator") {
    return (
      <span className={clsx(css["icon_large"], className)}>
        <FactionIcon code={card.faction_code} />
      </span>
    );
  }

  if (card.type_code === "skill") {
    return (
      <span className={clsx(css["icon_skill"], className)}>
        <FactionIcon className={css["icon-child"]} code={card.faction_code} />
        <LevelIcon level={card.xp} className={css["icon-level"]} />
      </span>
    );
  }

  return (
    <span
      className={clsx(
        css["icon_cost"],
        `color-${card.faction_code}`,
        className,
      )}
    >
      {card.cost && card.cost > 10 ? (
        <span className={clsx(css["icon-children"])}>
          <CostIcon cost={card.cost.toString().split("")[0]} />
          <CostIcon cost={card.cost.toString().split("")[1]} />
        </span>
      ) : (
        <CostIcon className={css["icon-child"]} cost={card.cost} />
      )}
      <LevelIcon className={css["icon-level"]} level={card.xp} />
    </span>
  );
}
