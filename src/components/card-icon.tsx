import clsx from "clsx";

import type { Card } from "@/store/services/queries.types";
import { cardLevel, getCardColor } from "@/utils/card-utils";

import css from "./card-icon.module.css";

import { CostIcon } from "./icons/cost-icon";
import EncounterIcon from "./icons/encounter-icon";
import { FactionIcon } from "./icons/faction-icon";
import { LevelIcon } from "./icons/level-icon";

type Props = {
  card: Card;
  className?: string;
  inverted?: boolean;
};

export function CardIcon(props: Props) {
  if (props.card.subtype_code && props.card.type_code === "treachery") {
    return (
      <span
        className={clsx(
          css["icon_weakness"],
          props.className,
          props.inverted && css["icon_inverted"],
        )}
      >
        <i className="icon-weakness" />
      </span>
    );
  }

  if (props.card.faction_code === "mythos") {
    return (
      <div
        className={clsx(
          css["icon_mythos"],
          props.className,
          props.inverted && css["icon_inverted"],
        )}
      >
        <EncounterIcon code={props.card.encounter_code} />
      </div>
    );
  }

  if (props.card.type_code === "investigator") {
    return (
      <div
        className={clsx(
          css["icon_large"],
          props.className,
          props.inverted && css["icon_inverted"],
        )}
      >
        <FactionIcon code={props.card.faction_code} />
      </div>
    );
  }

  const level = cardLevel(props.card);
  if (props.card.type_code === "skill") {
    return (
      <div
        className={clsx(
          css["icon_skill"],
          props.className,
          props.inverted && css["icon_inverted"],
        )}
      >
        <FactionIcon
          className={css["icon-child"]}
          code={props.card.faction_code}
        />
        <LevelIcon
          className={css["icon-level"]}
          inverted={props.inverted}
          level={level}
        />
      </div>
    );
  }

  const colorCls = getCardColor(props.card);

  return (
    <div
      className={clsx(
        css["icon_cost"],
        colorCls,
        props.className,
        props.inverted && css["icon_inverted"],
      )}
    >
      {props.card.cost && props.card.cost >= 10 ? (
        <span className={clsx(css["icon-children"])}>
          <CostIcon cost={props.card.cost.toString().split("")[0]} />
          <CostIcon cost={props.card.cost.toString().split("")[1]} />
        </span>
      ) : (
        <CostIcon className={css["icon-child"]} cost={props.card.cost} />
      )}
      <LevelIcon
        className={css["icon-level"]}
        inverted={props.inverted}
        level={level}
      />
    </div>
  );
}
