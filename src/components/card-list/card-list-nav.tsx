import { useMemo } from "react";

import { NONE } from "@/store/lib/grouping";
import type { ListState } from "@/store/selectors/card-list";
import type { Metadata } from "@/store/slices/metadata.types";

import css from "./card-list.module.css";

import { Select } from "../ui/select";
import { getGroupingKeyLabel } from "./Grouphead";

type Props = {
  data: ListState | undefined;
  metadata: Metadata;
  onSelectGroup: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function CardListNav({ data, metadata, onSelectGroup }: Props) {
  const jumpToOptions = useMemo(
    () =>
      data?.groups.map((group, i) => {
        const count = data.groupCounts[i];

        const keys = group.key.split("|");
        const types = group.type.split("|");
        const isAsset = group.key.includes("asset");

        const groupLabel = keys
          .map((key, i) => {
            if (!isAsset && key === NONE) return null;
            const label = getGroupingKeyLabel(types[i], key, metadata);
            return label;
          })
          .filter(Boolean)
          .join(" · ");

        return {
          label: `${groupLabel} (${count})`,
          value: group.key,
        };
      }),
    [data, metadata],
  );

  if (data == null) return null;

  return (
    <nav className={css["nav"]}>
      <output data-testid="cardlist-count">
        {data?.cards.length ?? 0} cards
      </output>
      {data && (
        <Select
          className={css["nav-jump"]}
          emptyLabel="Jump to..."
          onChange={onSelectGroup}
          options={jumpToOptions ?? []}
          value=""
        />
      )}
    </nav>
  );
}
