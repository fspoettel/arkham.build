import { cx } from "@/utils/cx";
import { Fragment } from "react/jsx-runtime";

import { useStore } from "@/store";
import {
  selectActiveList,
  selectActiveListFilters,
} from "@/store/selectors/lists";

import css from "./filters.module.css";

import { FilterX } from "lucide-react";
import { CollapseSidebarButton } from "../collapse-sidebar-button";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Scroller } from "../ui/scroller";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ActionFilter } from "./action-filter";
import { AssetFilter } from "./asset-filter";
import { CardTypeFilter } from "./card-type-filter";
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

export function Filters(props: Props) {
  const resetFilters = useStore((state) => state.resetFilters);
  const activeList = useStore(selectActiveList);
  const filters = useStore(selectActiveListFilters);
  const setFiltersOpen = useStore((state) => state.setFiltersOpen);

  const filtersEnabled = activeList?.filtersEnabled ?? true;
  const updateFiltersEnabled = useStore((state) => state.setFiltersEnabled);

  return (
    <search
      className={cx(
        css["filters"],
        props.className,
        !filtersEnabled && css["disabled"],
      )}
    >
      <CollapseSidebarButton
        onClick={() => {
          setFiltersOpen(false);
        }}
        orientation="right"
        className={css["collapse"]}
      />

      {props.children && (
        <div className={css["children"]}>{props.children}</div>
      )}

      <CardTypeFilter className={css["card-type-filter"]} />

      <div className={css["header"]}>
        <Tooltip delay={300} placement="top-start">
          <TooltipTrigger asChild>
            <div>
              <Checkbox
                checked={filtersEnabled}
                id="toggle-filters"
                label={<h3 className={css["title"]}>Filters</h3>}
                onCheckedChange={updateFiltersEnabled}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {filtersEnabled ? "Disable filters" : "Enable filters"}
          </TooltipContent>
        </Tooltip>
        <div>
          <Button
            disabled={!filtersEnabled}
            onClick={resetFilters}
            size="sm"
            tooltip="Reset all filters"
            variant="bare"
          >
            <FilterX /> Reset
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
