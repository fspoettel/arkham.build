import clsx from "clsx";

import SvgCard from "@/assets/icons/card-outline.svg?react";
import SvgPaintbrush from "@/assets/icons/paintbrush.svg?react";
import type {
  CardResolved,
  CardWithRelations,
} from "@/store/selectors/card-view";
import type { Cycle, Pack } from "@/store/services/types";
import { CYCLES_WITH_STANDALONE_PACKS } from "@/utils/constants";

import css from "./card-meta.module.css";

import EncounterIcon from "../icons/encounter-icon";
import PackIcon from "../icons/pack-icon";

type Props = {
  resolvedCard: CardWithRelations;
  size: "full" | "compact" | "tooltip";
};

function PackEntry({
  resolvedCard,
  skipCycle,
  size,
}: {
  resolvedCard: CardResolved;
  size: Props["size"];
  skipCycle?: boolean;
}) {
  const { card, cycle, encounterSet, pack } = resolvedCard;
  const displayPack = cycleOrPack(cycle, pack);

  return (
    <>
      {encounterSet ? (
        <>
          {size === "full" && (
            <p className={css["meta-property"]}>
              {encounterSet.name} <EncounterIcon code={card.encounter_code} />{" "}
              {getEncounterPositions(
                card.encounter_position ?? 1,
                card.quantity,
              )}
            </p>
          )}
          {(size !== "full" ||
            (!skipCycle && encounterSet.name !== displayPack.real_name)) && (
            <p className={css["meta-property"]}>
              {displayPack.real_name} <PackIcon code={displayPack.code} />{" "}
              <strong>{card.pack_position}</strong>
            </p>
          )}
        </>
      ) : (
        <>
          {size !== "full" && (
            <p className={css["meta-property"]}>
              {displayPack.real_name} <PackIcon code={displayPack.code} />{" "}
              <strong>{card.pack_position}</strong>
            </p>
          )}
          {size === "full" && (
            <>
              <p className={css["meta-property"]}>
                {displayPack.real_name} <PackIcon code={displayPack.code} />{" "}
                <strong>{card.pack_position}</strong> <SvgCard /> x{" "}
                {card.quantity}
              </p>
              {!skipCycle && displayPack.real_name !== cycle.real_name && (
                <p className={css["meta-property"]}>
                  {cycle.real_name} <PackIcon code={cycle.code} />
                </p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export function CardMeta({ size, resolvedCard }: Props) {
  const illustrator = resolvedCard.card.illustrator;

  const duplicates = resolvedCard?.relations?.duplicates;

  return (
    <footer className={clsx(css["meta"], css[size])}>
      {size === "full" && illustrator && (
        <p className={css["meta-property"]}>
          <SvgPaintbrush /> {illustrator}
        </p>
      )}
      <PackEntry
        skipCycle={!!duplicates?.length}
        resolvedCard={resolvedCard}
        size={size}
      />
      {duplicates &&
        Object.values(duplicates).map((r) => (
          <PackEntry skipCycle key={r.card.code} resolvedCard={r} size={size} />
        ))}
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
  if (
    pack.real_name.includes("Expansion") ||
    CYCLES_WITH_STANDALONE_PACKS.includes(cycle.code)
  ) {
    return pack;
  }

  return cycle;
}
