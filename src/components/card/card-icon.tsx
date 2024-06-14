import clsx from "clsx";
import { Card } from "@/store/graphql/types";
import SvgWeakness from "@/assets/icons/weakness.svg?react";
import { FactionIcon } from "../ui/icons/faction-icon";
import { LevelIcon } from "../ui/icons/level-icon";
import { CostIcon } from "../ui/icons/cost-icon";
import { LazyEncounterIcon } from "../ui/icons/lazy-icons";

import css from "./card-icon.module.css";

type Props = {
  card: Card;
  className?: string;
  inverted?: boolean;
};

export function CardIcon({ card, className, inverted }: Props) {
  if (card.subtype_code && card.type_code === "treachery") {
    return (
      <span
        className={clsx(
          css["icon_weakness"],
          className,
          inverted && css["icon_inverted"],
        )}
      >
        <SvgWeakness />
      </span>
    );
  }

  if (card.faction_code === "mythos") {
    return (
      <div
        className={clsx(
          css["icon_large"],
          className,
          inverted && css["icon_inverted"],
        )}
      >
        <LazyEncounterIcon code={card.encounter_code} />
      </div>
    );
  }

  if (card.type_code === "investigator") {
    return (
      <div
        className={clsx(
          css["icon_large"],
          className,
          inverted && css["icon_inverted"],
        )}
      >
        <FactionIcon code={card.faction_code} />
      </div>
    );
  }

  if (card.type_code === "skill") {
    return (
      <div
        className={clsx(
          css["icon_skill"],
          className,
          inverted && css["icon_inverted"],
        )}
      >
        <FactionIcon className={css["icon-child"]} code={card.faction_code} />
        <LevelIcon
          inverted={inverted}
          level={card.xp}
          className={css["icon-level"]}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        css["icon_cost"],
        `color-${card.faction_code}`,
        className,
        inverted && css["icon_inverted"],
      )}
    >
      {card.cost && card.cost >= 10 ? (
        <span className={clsx(css["icon-children"])}>
          <CostIcon cost={card.cost.toString().split("")[0]} />
          <CostIcon cost={card.cost.toString().split("")[1]} />
        </span>
      ) : (
        <CostIcon className={css["icon-child"]} cost={card.cost} />
      )}
      <LevelIcon
        inverted={inverted}
        className={css["icon-level"]}
        level={card.xp}
      />
    </div>
  );
}
