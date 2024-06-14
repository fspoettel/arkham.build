import { useStore } from "@/store";
import css from "./filters.module.css";
import { selectIsInitialized } from "@/store/selectors";
import { selectActiveCardType } from "@/store/selectors/filters";
import { FactionFilter } from "./faction-filter";
import { LevelFilter } from "./level-filter";
import { CostFilter } from "./cost-filter";
import { SkillIconsFilter } from "./skill-icons-filter";
import { TypeFilter } from "./type-filter";
import { TraitFilter } from "./trait-filter";
import { ActionFilter } from "./action-filter";
import { SubtypeFilter } from "./subtypes-filter";
import { PropertiesFilter } from "./properties-filter";

export function Filters() {
  const isInitalized = useStore(selectIsInitialized);
  const cardTypeSelection = useStore(selectActiveCardType);
  const resetFilters = useStore((state) => state.resetFilters);

  if (!isInitalized) return null;

  return (
    <search className={css["filters"]} title="Filters">
      <div className={css["filter-header"]}>
        <button className="button button-bare" onClick={resetFilters}>
          Reset
        </button>
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
