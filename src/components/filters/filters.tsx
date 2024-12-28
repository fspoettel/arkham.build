import { useListLayoutContext } from "@/layouts/list-layout-context";
import { useStore } from "@/store";
import {
  selectActiveList,
  selectActiveListFilters,
} from "@/store/selectors/lists";
import { cx } from "@/utils/cx";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { FilterXIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { CollapseSidebarButton } from "../collapse-sidebar-button";
import { PreviewBanner } from "../preview-banner";
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
import css from "./filters.module.css";
import { HealthFilter } from "./health-filter";
import { InvestigatorCardAccessFilter } from "./investigator-card-access-filter";
import { InvestigatorFilter } from "./investigator-filter";
import { InvestigatorSkillsFilter } from "./investigator-skills-filter";
import { LevelFilter } from "./level-filter";
import { OwnershipFilter } from "./ownership-filter";
import { PackFilter } from "./pack-filter";
import { PropertiesFilter } from "./properties-filter";
import { SanityFilter } from "./sanity-filter";
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
  const { resolvedDeck } = useResolvedDeck();

  const activeList = useStore(selectActiveList);
  const filters = useStore(selectActiveListFilters);
  const resetFilters = useStore((state) => state.resetFilters);
  const { setFiltersOpen } = useListLayoutContext();
  const updateFiltersEnabled = useStore((state) => state.setFiltersEnabled);

  const filtersEnabled = activeList?.filtersEnabled ?? true;

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

      <PreviewBanner />

      {props.children && (
        <div className={css["children"]}>{props.children}</div>
      )}

      {activeList?.key !== "create_deck" && (
        <CardTypeFilter className={css["card-type-filter"]} />
      )}

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
            <FilterXIcon /> Reset
          </Button>
        </div>
      </div>
      <Scroller type="hover">
        <div className={css["content"]}>
          {filters.map((filter, id) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: index is unique key.
            <Fragment key={id}>
              {filter === "action" && (
                <ActionFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "asset" && (
                <AssetFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "cost" && (
                <CostFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "encounterSet" && <EncounterSetFilter id={id} />}
              {filter === "investigator" && <InvestigatorFilter id={id} />}
              {filter === "level" && <LevelFilter id={id} />}
              {filter === "ownership" && <OwnershipFilter id={id} />}
              {filter === "pack" && <PackFilter id={id} />}
              {filter === "properties" && <PropertiesFilter id={id} />}
              {filter === "skillIcons" && <SkillIconsFilter id={id} />}
              {filter === "subtype" && (
                <SubtypeFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "trait" && (
                <TraitFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "tabooSet" && <TabooSetFilter id={id} />}
              {filter === "type" && (
                <TypeFilter id={id} resolvedDeck={resolvedDeck} />
              )}

              {filter === "faction" && <FactionFilter id={id} />}

              {filter === "investigatorSkills" && (
                <InvestigatorSkillsFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "investigatorCardAccess" && (
                <InvestigatorCardAccessFilter id={id} />
              )}
              {filter === "health" && (
                <HealthFilter id={id} resolvedDeck={resolvedDeck} />
              )}
              {filter === "sanity" && (
                <SanityFilter id={id} resolvedDeck={resolvedDeck} />
              )}
            </Fragment>
          ))}
        </div>
      </Scroller>
    </search>
  );
}
