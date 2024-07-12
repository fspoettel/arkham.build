import { cx } from "@/utils/cx";

import type { CardWithRelations, ResolvedCard } from "@/store/lib/types";
import { isCardWithRelations } from "@/store/lib/types";
import type { Cycle, Pack } from "@/store/services/queries.types";
import { CYCLES_WITH_STANDALONE_PACKS } from "@/utils/constants";

import css from "./card.module.css";

import EncounterIcon from "../icons/encounter-icon";
import PackIcon from "../icons/pack-icon";

type Props = {
  resolvedCard: ResolvedCard | CardWithRelations;
  size: "tooltip" | "compact" | "full";
  skipCycle?: boolean;
};

function EncounterEntry(props: Props) {
  const { card, cycle, encounterSet, pack } = props.resolvedCard;

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

function PlayerEntry(props: Props) {
  const { resolvedCard, size } = props;
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
            {duplicate.card.pack_position} <i className="icon-card_outline" /> ×
            {duplicate.card.quantity}
          </p>
        ))}
      <p className={css["meta-property"]}>
        {displayPack.real_name} <PackIcon code={displayPack.code} />{" "}
        {card.pack_position} <i className="icon-card-outline-bold" /> ×
        {card.quantity}
      </p>
    </>
  );
}

function PackEntries(props: Props) {
  const { resolvedCard, size } = props;
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

export function CardMeta(props: Props) {
  const { resolvedCard, size } = props;
  const illustrator = resolvedCard.card.illustrator;

  return (
    <footer className={cx(css["meta"], css[size])}>
      {size === "full" && illustrator && (
        <p className={css["meta-property"]}>
          <i className="icon-paintbrush" /> {illustrator}
        </p>
      )}
      <PackEntries resolvedCard={resolvedCard} size={size} />
    </footer>
  );
}

export function CardMetaBack(props: { illustrator?: string }) {
  return (
    <footer className={css["meta"]}>
      {props.illustrator && (
        <p className={css["meta-property"]}>
          <i className="icon-paintbrush" /> {props.illustrator}
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
