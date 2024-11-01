import { NONE, getGroupingKeyLabel } from "@/store/lib/grouping";
import type { CardGroup } from "@/store/selectors/lists";
import type { Metadata } from "@/store/slices/metadata.types";
import { cx } from "@/utils/cx";
import { CardSlots } from "../card-slots";
import EncounterIcon from "../icons/encounter-icon";
import { FactionIcon } from "../icons/faction-icon";
import PackIcon from "../icons/pack-icon";
import css from "./grouphead.module.css";

type Props = {
  className?: string;
  grouping: CardGroup;
  metadata: Metadata;
  variant?: "alt";
};

export function Grouphead(props: Props) {
  const { className, grouping, metadata, variant } = props;
  const keys = grouping.key.split("|");
  const types = grouping.type.split("|");

  return (
    <h3 className={cx(css["grouphead"], variant && css[variant], className)}>
      {keys.map((key, i) => {
        const type = types[i];
        const keyLabel = getGroupingKeyLabel(type, key, metadata);

        if (!keyLabel) return null;

        if (
          type === "subtype" ||
          type === "type" ||
          type === "level" ||
          type === "cost" ||
          type === "base_upgrades"
        ) {
          // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
          return <span key={i}>{keyLabel}</span>;
        }

        if (type === "cycle") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <span key={i}>
              <PackIcon className={css["icon"]} code={key} />
              <span>{keyLabel}</span>
            </span>
          );
        }

        if (type === "encounter_set") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <span key={i}>
              <EncounterIcon className={css["icon"]} code={key} />
              <span>{keyLabel}</span>
            </span>
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
            <span key={i}>
              <CardSlots className={css["icon"]} size="small" slot={key} />
              <span>{keyLabel}</span>
            </span>
          );
        }

        if (type === "faction") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <span key={i}>
              <FactionIcon className={css["icon"]} code={key} />
              <span>{keyLabel}</span>
            </span>
          );
        }

        if (type === "pack") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            <span key={i}>
              <PackIcon className={css["icon"]} code={key} />
              <span>{keyLabel}</span>
            </span>
          );
        }

        return null;
      })}
    </h3>
  );
}
