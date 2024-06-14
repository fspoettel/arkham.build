import { FactionFilter } from "./faction-filter";

import { LevelFilter } from "./level-filter";
import { CostFilter } from "./cost-filter";

import { PropertiesFilter } from "./properties-filter";

export function PlayerCardFilters() {
  return (
    <>
      <FactionFilter />
      <LevelFilter />
      <CostFilter />
      <PropertiesFilter />
    </>
  );
}
