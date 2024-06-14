import SvgCard from "@/assets/icons/card-outline.svg?react";
import SvgPaintbrush from "@/assets/icons/paintbrush.svg?react";
import { Cycle, Pack } from "@/store/graphql/types";
import { CardResolved } from "@/store/selectors/card-detail";

import css from "./card-meta.module.css";

import { LazyEncounterIcon, LazyPackIcon } from "../ui/icons/lazy-icons";

type Props = {
  resolvedCard: CardResolved;
  isBack?: boolean;
};

function getEncounterPositions(position: number, quantity: number) {
  if (quantity === 1) return position;
  const start = position;
  const end = position + quantity - 1;
  return `${start}-${end}`;
}

function cycleOrPack(cycle: Cycle, pack: Pack) {
  if (
    pack.real_name.includes("Expansion") ||
    [
      "core",
      "return",
      "investigator",
      "promotional",
      "parallel",
      "side_stories",
    ].includes(cycle.code)
  ) {
    return pack;
  }

  return cycle;
}

export function CardMeta({ isBack, resolvedCard }: Props) {
  const { card, cycle, encounterSet, pack } = resolvedCard;

  const illustrator = isBack
    ? card.back_illustrator && card.back_illustrator !== card.illustrator
      ? card.back_illustrator
      : undefined
    : card.illustrator;

  const displayPack = cycleOrPack(cycle, pack);

  return (
    <footer className={css["meta"]}>
      {illustrator && (
        <p className={css["meta-property"]}>
          <SvgPaintbrush /> {illustrator}
        </p>
      )}

      {encounterSet ? (
        <>
          <p className={css["meta-property"]}>
            {encounterSet.name} <LazyEncounterIcon code={card.encounter_code} />{" "}
            {getEncounterPositions(card.encounter_position ?? 1, card.quantity)}
          </p>
          <p className={css["meta-property"]}>
            {displayPack.real_name} <LazyPackIcon code={displayPack.code} />{" "}
            <strong>{card.pack_position}</strong>
          </p>
        </>
      ) : (
        <>
          <p className={css["meta-property"]}>
            {displayPack.real_name} <LazyPackIcon code={displayPack.code} />{" "}
            <strong>{card.pack_position}</strong> <SvgCard /> x {card.quantity}
          </p>
          {pack.real_name !== displayPack.real_name && (
            <p className={css["meta-property"]}>{pack.real_name}</p>
          )}
        </>
      )}
    </footer>
  );
}
