import { Fragment } from "react/jsx-runtime";

import { NONE } from "@/store/lib/grouping";
import type { CardGroup } from "@/store/selectors/card-list";
import type { Metadata } from "@/store/slices/metadata.types";
import { capitalize } from "@/utils/formatting";

import css from "./grouphead.module.css";

import { CardSlots } from "../card-slots";
import EncounterIcon from "../icons/encounter-icon";
import { FactionIcon } from "../icons/faction-icon";
import PackIcon from "../icons/pack-icon";

type Props = {
  grouping: CardGroup;
  metadata: Metadata;
};

export function getGroupingKeyLabel(
  type: string,
  segment: string,
  metadata: Metadata,
) {
  switch (type) {
    case "subtype": {
      if (segment === "weakness") return "Weakness";
      if (segment === "basicweakness") return "Basic Weakness";
      return "";
    }

    case "type": {
      return capitalize(segment);
    }

    case "cycle": {
      return metadata.cycles[segment]?.real_name ?? "";
    }

    case "encounter_set": {
      return metadata.encounterSets[segment]?.name ?? "";
    }

    case "slot": {
      if (segment === NONE) return "No Slot";
      if (segment === "permanent") return "Permanent";
      return capitalize(segment);
    }

    case "level": {
      if (segment === NONE) return "No level";
      return `Level ${segment}`;
    }

    case "cost": {
      if (segment === NONE) return "No cost";
      if (segment === "-2") return "Cost X";
      return `Cost ${segment}`;
    }

    case "faction": {
      return segment === "multiclass"
        ? "Multiclass"
        : metadata.factions[segment]?.name ?? "";
    }

    case "default": {
      return segment;
    }
  }

  return "";
}

export function Grouphead({ grouping, metadata }: Props) {
  const keys = grouping.key.split("|");
  const types = grouping.type.split("|");

  return (
    <h3 className={css["grouphead"]}>
      {keys.map((key, i) => {
        const type = types[i];
        const keyLabel = getGroupingKeyLabel(type, key, metadata);

        if (!keyLabel) return null;

        if (
          type === "subtype" ||
          type === "type" ||
          type === "level" ||
          type === "cost"
        ) {
          // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
          return <span key={i}>{keyLabel}</span>;
        }

        if (type === "cycle") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <Fragment key={i}>
              <PackIcon className={css["icon"]} code={key} />
              <span>{keyLabel}</span>
            </Fragment>
          );
        }

        if (type === "encounter_set") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <Fragment key={i}>
              <EncounterIcon className={css["icon"]} code={key} />
              <span>{keyLabel}</span>
            </Fragment>
          );
        }

        if (type === "slot") {
          if (key === NONE) {
            return grouping.key.includes("asset") ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
              <span key={i}>{keyLabel}</span>
            ) : null;
          }

          if (key === "permanent") {
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            return <span key={i}>{keyLabel}</span>;
          }

          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <Fragment key={i}>
              <CardSlots className={css["icon"]} size="small" slot={key} />
              <span>{keyLabel}</span>
            </Fragment>
          );
        }

        if (type === "faction") {
          return (
            <>
              <FactionIcon className={css["icon"]} code={key} />

              {/* biome-ignore lint/suspicious/noArrayIndexKey: order is stable. */}
              <span key={i}>{keyLabel}</span>
            </>
          );
        }

        return null;
      })}
    </h3>
  );
}
