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

export function Grouphead({ grouping, metadata }: Props) {
  const isAsset = grouping.key.includes("asset");

  const keys = grouping.key.split("|");
  const types = grouping.type.split("|");

  return (
    <h3 className={css["grouphead"]}>
      {keys.map((key, i) => {
        const type = types[i];

        if (type === "subtype") {
          if (key === NONE) return null;
          if (key === "weakness") return <span key={i}>Weakness</span>;
          if (key === "basicweakness")
            return <span key={i}>Basic Weakness</span>;
        }

        if (type === "type") {
          if (key === NONE) return null;
          return <span key={i}>{capitalize(key)}</span>;
        }

        if (type === "cycle") {
          return (
            <Fragment key={i}>
              <PackIcon className={css["icon"]} code={key} />
              <span>{metadata.cycles[key]?.real_name}</span>
            </Fragment>
          );
        }

        if (type === "encounter_set") {
          return (
            <Fragment key={i}>
              <EncounterIcon className={css["icon"]} code={key} />
              <span>{metadata.encounterSets[key]?.name}</span>
            </Fragment>
          );
        }

        if (type === "slot") {
          if (key === NONE) {
            return isAsset ? <span key={i}>Other</span> : null;
          }
          return (
            <Fragment key={i}>
              <CardSlots className={css["icon"]} size="small" slot={key} />
              <span>{key}</span>
            </Fragment>
          );
        }

        if (type === "level") {
          if (key === NONE) return <span key={i}>No level</span>;
          return <span key={i}>Level {key}</span>;
        }

        if (type === "cost") {
          if (key === NONE) return <span key={i}>No cost</span>;
          if (key === "-2") return <span key={i}>X</span>;
          return <span key={i}>Cost {key}</span>;
        }

        if (type === "faction") {
          return (
            <>
              <FactionIcon className={css["icon"]} code={key} />
              <span key={i}>
                {key === "multiclass"
                  ? "Multiclass"
                  : metadata.factions[key]?.name}
              </span>
            </>
          );
        }

        return null;
      })}
    </h3>
  );
}
