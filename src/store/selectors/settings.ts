import { createSelector } from "reselect";

import type { Cycle, Pack } from "../services/types";
import type { StoreState } from "../slices";

type CycleWithPacks = (Cycle & {
  packs: Pack[];
  reprintPacks: Pack[];
})[];

export const selectCyclesAndPacks = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (metadata, lookupTables) => {
    const cycles: CycleWithPacks = Object.entries(
      lookupTables.packsByCycle,
    ).map(([cycleCode, packTable]) => {
      const cycle = metadata.cycles[cycleCode];

      const packs: Pack[] = [];
      const reprintPacks: Pack[] = [];

      for (const code of Object.keys(packTable)) {
        const pack = metadata.packs[code];
        (pack.reprint ? reprintPacks : packs).push(pack);
      }

      reprintPacks.sort((a, b) => a.position - b.position);
      packs.sort((a, b) => a.position - b.position);

      return { ...cycle, packs, reprintPacks };
    });

    cycles.sort((a, b) => a.position - b.position);

    return cycles;
  },
);
