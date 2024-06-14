import SvgFilterClear from "@/assets/icons/filter-clear.svg?react";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";
import { selectActiveCardType } from "@/store/selectors/filters/shared";

import css from "./filters.module.css";

import { Button } from "../ui/button";
import { ActionFilter } from "./action-filter";
import { CostFilter } from "./cost-filter";
import { FactionFilter } from "./faction-filter";
import { InvestigatorFilter } from "./investigator-filter";
import { LevelFilter } from "./level-filter";
import { OwnershipFilter } from "./ownership-filter";
import { PropertiesFilter } from "./properties-filter";
import { SkillIconsFilter } from "./skill-icons-filter";
import { SubtypeFilter } from "./subtype-filter";
import { TabooSetFilter } from "./taboo-set-filter";
import { TraitFilter } from "./trait-filter";
import { TypeFilter } from "./type-filter";

export function Filters() {
  const isInitalized = useStore(selectIsInitialized);
  const touched = useStore((state) => state.filters.touched);

  const cardTypeSelection = useStore(selectActiveCardType);
  const resetFilters = useStore((state) => state.resetFilters);

  if (!isInitalized) return null;

  return (
    <search className={css["filters"]} title="Filters">
      <div className={css["filters-header"]}>
        <h3 className={css["filters-title"]}>Filters</h3>
        <Button onClick={resetFilters} variant="bare" disabled={!touched}>
          <SvgFilterClear />
        </Button>
      </div>
      <div className={css["filters-container"]}>
        <FactionFilter />
        <OwnershipFilter />
        {cardTypeSelection === "player" && <LevelFilter />}
        <CostFilter />
        <TypeFilter />
        <SubtypeFilter />
        <TraitFilter />
        <SkillIconsFilter />
        <ActionFilter />
        <PropertiesFilter />
        {cardTypeSelection === "player" && <InvestigatorFilter />}
        {cardTypeSelection === "player" && <TabooSetFilter />}
      </div>
    </search>
  );
}
