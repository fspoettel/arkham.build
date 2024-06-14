import clsx from "clsx";

import SvgWeakness from "@/assets/icons/weakness.svg?react";
import type { Card } from "@/store/services/types";
import { getCardColor } from "@/utils/card-utils";

import css from "./card-icon.module.css";

import { CostIcon } from "../icons/cost-icon";
import EncounterIcon from "../icons/encounter-icon";
import { FactionIcon } from "../icons/faction-icon";
import { LevelIcon } from "../icons/level-icon";

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
          css["icon_mythos"],
          className,
          inverted && css["icon_inverted"],
        )}
      >
        <EncounterIcon code={card.encounter_code} />
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

  const colorCls = getCardColor(card);

  return (
    <div
      className={clsx(
        css["icon_cost"],
        colorCls,
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
