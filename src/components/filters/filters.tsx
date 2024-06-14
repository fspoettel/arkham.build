import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";
import { selectActiveCardType } from "@/store/selectors/filters";

import css from "./filters.module.css";

import { Button } from "../ui/button";
import { ActionFilter } from "./action-filter";
import { CostFilter } from "./cost-filter";
import { FactionFilter } from "./faction-filter";
import { LevelFilter } from "./level-filter";
import { PropertiesFilter } from "./properties-filter";
import { SkillIconsFilter } from "./skill-icons-filter";
import { SubtypeFilter } from "./subtypes-filter";
import { TraitFilter } from "./trait-filter";
import { TypeFilter } from "./type-filter";

export function Filters() {
  const isInitalized = useStore(selectIsInitialized);
  const cardTypeSelection = useStore(selectActiveCardType);
  const resetFilters = useStore((state) => state.resetFilters);

  if (!isInitalized) return null;

  return (
    <search className={css["filters"]} title="Filters">
      <div className={css["filter-header"]}>
        <Button onClick={resetFilters}>Reset</Button>
      </div>
      <FactionFilter />
      {cardTypeSelection === "player" && <LevelFilter />}
      <CostFilter />
      <TypeFilter />
      <SubtypeFilter />
      <TraitFilter />
      <SkillIconsFilter />
      <ActionFilter />
      <PropertiesFilter />
    </search>
  );
}
