import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { Metadata } from "@/store/slices/metadata/types";
import { SettingsState } from "@/store/slices/settings/types";
import { pass } from "@/utils/fp";

function filterOwnership(
  card: Card,
  metadata: Metadata,
  lookupTables: LookupTables,
  setting: SettingsState["collection"],
) {
  // direct pack ownership.
  if (setting[card.pack_code]) return true;

  // ownership of the new format.
  const pack = metadata.packs[card.pack_code];
  const reprintId = `${pack.cycle_code}${card.encounter_code ? "c" : "p"}`;
  if (setting[reprintId]) return true;

  // revised core.
  if (!setting["rcore"]) return false;

  // core.
  if (card.pack_code === "core") return true;

  // reprints from other cycles.
  const duplicates = lookupTables.relations.duplicates[card.code];

  return (
    duplicates &&
    Object.keys(duplicates).some((code) => {
      const packCode = metadata.cards[code].pack_code;
      return packCode && setting[packCode];
    })
  );
}

export const selectOwnershipFilter = createSelector(
  (state: StoreState) => state.settings.collection,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters[state.filters.cardType].ownership.value,
  (setting, metadata, lookupTables, filterState) => {
    if (!Object.keys(setting).length || filterState === "all") return pass;
    return (card: Card) => {
      const ownsCard = filterOwnership(card, metadata, lookupTables, setting);
      return filterState === "owned" ? ownsCard : !ownsCard;
    };
  },
);

export const selectValue = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].ownership,
  (filterState) => filterState.value,
);

export const selectOpen = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].ownership,
  (filterState) => filterState.open,
);
