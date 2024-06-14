import clsx from "clsx";

import SvgCard from "@/assets/icons/card-outline.svg?react";
import SvgPaintbrush from "@/assets/icons/paintbrush.svg?react";
import type { Cycle, Pack } from "@/store/services/types";
import type {
  CardResolved,
  CardWithRelations,
} from "@/store/utils/card-resolver";
import { isCardWithRelations } from "@/utils/card-utils";
import { CYCLES_WITH_STANDALONE_PACKS } from "@/utils/constants";

import css from "./card-meta.module.css";

import EncounterIcon from "../icons/encounter-icon";
import PackIcon from "../icons/pack-icon";

type Props = {
  resolvedCard: CardResolved | CardWithRelations;
  size: "tooltip" | "compact" | "full";
  skipCycle?: boolean;
};

function EncounterEntry({ resolvedCard }: Props) {
  const { card, cycle, encounterSet, pack } = resolvedCard;

  if (!encounterSet) return null;

  const displayPack = cycleOrPack(cycle, pack);

  return (
    <>
      <p className={css["meta-property"]}>
        {encounterSet.name} <EncounterIcon code={card.encounter_code} />{" "}
        {getEncounterPositions(card.encounter_position ?? 1, card.quantity)}
      </p>
      <p className={css["meta-property"]}>
        {displayPack.real_name} <PackIcon code={displayPack.code} />{" "}
        {card.pack_position}
      </p>
    </>
  );
}

function PlayerEntry({ resolvedCard, size }: Props) {
  const { card, cycle, pack } = resolvedCard;
  const duplicates = isCardWithRelations(resolvedCard)
    ? resolvedCard.relations?.duplicates
    : [];

  const displayPack = cycleOrPack(cycle, pack);

  return (
    <>
      {size === "full" &&
        !!duplicates?.length &&
        duplicates.map((duplicate) => (
          <p className={css["meta-property"]} key={duplicate.card.code}>
            {duplicate.pack.real_name} <PackIcon code={duplicate.pack.code} />{" "}
            {duplicate.card.pack_position} <SvgCard /> ×
            {duplicate.card.quantity}
          </p>
        ))}
      <p className={css["meta-property"]}>
        {displayPack.real_name} <PackIcon code={displayPack.code} />{" "}
        {card.pack_position} <SvgCard /> ×{card.quantity}
      </p>
    </>
  );
}

function PackEntries({ resolvedCard, size }: Props) {
  const { card, encounterSet } = resolvedCard;
  const isEncounter = encounterSet && card.encounter_code;
  return (
    <>
      {isEncounter ? (
        <EncounterEntry resolvedCard={resolvedCard} size={size} />
      ) : (
        <PlayerEntry resolvedCard={resolvedCard} size={size} />
      )}
    </>
  );
}

export function CardMeta({ size, resolvedCard }: Props) {
  const illustrator = resolvedCard.card.illustrator;

  return (
    <footer className={clsx(css["meta"], css[size])}>
      {size === "full" && illustrator && (
        <p className={css["meta-property"]}>
          <SvgPaintbrush /> {illustrator}
        </p>
      )}
      <PackEntries resolvedCard={resolvedCard} size={size} />
    </footer>
  );
}

export function CardMetaBack({ illustrator }: { illustrator?: string }) {
  return (
    <footer className={css["meta"]}>
      {illustrator && (
        <p className={css["meta-property"]}>
          <SvgPaintbrush /> {illustrator}
        </p>
      )}
    </footer>
  );
}

function getEncounterPositions(position: number, quantity: number) {
  if (quantity === 1) return position;
  const start = position;
  const end = position + quantity - 1;
  return `${start}-${end}`;
}

function cycleOrPack(cycle: Cycle, pack: Pack) {
  if (CYCLES_WITH_STANDALONE_PACKS.includes(cycle.code)) {
    return pack;
  }

  return cycle;
}
