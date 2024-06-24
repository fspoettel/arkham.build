import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";

import { useStore } from "@/store";
import {
  selectActiveList,
  selectActiveListFilters,
} from "@/store/selectors/lists";

import css from "./filters.module.css";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Scroller } from "../ui/scroller";
import { ActionFilter } from "./action-filter";
import { AssetFilter } from "./asset-filter";
import { CostFilter } from "./cost-filter";
import { EncounterSetFilter } from "./encounter-set-filter";
import { FactionFilter } from "./faction-filter";
import { InvestigatorFilter } from "./investigator-filter";
import { LevelFilter } from "./level-filter";
import { OwnershipFilter } from "./ownership-filter";
import { PackFilter } from "./pack-filter";
import { PropertiesFilter } from "./properties-filter";
import { SkillIconsFilter } from "./skill-icons-filter";
import { SubtypeFilter } from "./subtype-filter";
import { TabooSetFilter } from "./taboo-set-filter";
import { TraitFilter } from "./trait-filter";
import { TypeFilter } from "./type-filter";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function Filters({ className, children }: Props) {
  const resetFilters = useStore((state) => state.resetFilters);
  const activeList = useStore(selectActiveList);
  const filters = useStore(selectActiveListFilters);

  const filtersEnabled = activeList?.filtersEnabled ?? true;
  const updateFiltersEnabled = useStore((state) => state.setFiltersEnabled);

  return (
    <search
      className={clsx(
        css["filters"],
        className,
        !filtersEnabled && css["disabled"],
      )}
      title="Filters"
    >
      {children && <div className={css["children"]}>{children}</div>}
      <div className={css["header"]}>
        <Checkbox
          checked={filtersEnabled}
          id="toggle-filters"
          label={
            <h3 className={css["title"]} title="Disable filters">
              Filters
            </h3>
          }
          onCheckedChange={updateFiltersEnabled}
          title="Disable filters"
        />
        <div>
          <Button
            disabled={!filtersEnabled}
            onClick={resetFilters}
            size="sm"
            variant="bare"
          >
            <i className="icon-filter-clear" /> Reset
          </Button>
        </div>
      </div>
      <Scroller>
        <div className={css["content"]}>
          {filters.map((filter, id) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: index is unique key.
            <Fragment key={id}>
              {filter === "faction" && <FactionFilter id={id} />}
              {filter === "level" && <LevelFilter id={id} />}
              {filter === "ownership" && <OwnershipFilter id={id} />}
              {filter === "investigator" && <InvestigatorFilter id={id} />}
              {filter === "pack" && <PackFilter id={id} />}
              {filter === "subtype" && <SubtypeFilter id={id} />}
              {filter === "type" && <TypeFilter id={id} />}
              {filter === "tabooSet" && <TabooSetFilter id={id} />}
              {filter === "trait" && <TraitFilter id={id} />}
              {filter === "action" && <ActionFilter id={id} />}
              {filter === "properties" && <PropertiesFilter id={id} />}
              {filter === "skillIcons" && <SkillIconsFilter id={id} />}
              {filter === "cost" && <CostFilter id={id} />}
              {filter === "asset" && <AssetFilter id={id} />}
              {filter === "encounterSet" && <EncounterSetFilter id={id} />}
            </Fragment>
          ))}
        </div>
      </Scroller>
    </search>
  );
}
