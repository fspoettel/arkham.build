import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectAssetChanges,
  selectAssetOptions,
} from "@/store/selectors/lists";
import type { Coded } from "@/store/services/queries.types";
import { isAssetFilterObject } from "@/store/slices/lists.type-guards";
import type { AssetFilter } from "@/store/slices/lists.types";
import { assert } from "@/utils/assert";
import { capitalize } from "@/utils/formatting";

import css from "./filters.module.css";

import { SkillIcon } from "../icons/skill-icon";
import SlotIcon from "../icons/slot-icon";
import { Checkbox } from "../ui/checkbox";
import { Combobox } from "../ui/combobox/combobox";
import { RangeSelect } from "../ui/range-select";
import { FilterContainer } from "./primitives/filter-container";

function capitalizeCode(c: Coded) {
  return capitalize(c.code);
}

function renderSlot(c: Coded) {
  return (
    <>
      <SlotIcon code={c.code} /> {c.code}
    </>
  );
}

export function AssetFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isAssetFilterObject(filter),
    `AssetFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectAssetChanges(filter.value);
  const options = useStore(selectAssetOptions);

  const setFilterValue = useStore((state) => state.setFilterValue);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilter);

  const onOpenChange = useCallback(
    (value: boolean) => {
      setFilterOpen(id, value);
    },
    [setFilterOpen, id],
  );

  const onReset = useCallback(() => {
    resetFilter(id);
  }, [resetFilter, id]);

  const onChangeUses = useCallback(
    (value: string[]) => {
      setFilterValue(id, { uses: value });
    },
    [setFilterValue, id],
  );

  const onChangeSlot = useCallback(
    (value: string[]) => {
      setFilterValue(id, { slots: value });
    },
    [setFilterValue, id],
  );

  const onChangeRange = useCallback(
    function setValue<K extends keyof AssetFilter>(
      key: K,
      value: AssetFilter[K],
    ) {
      setFilterValue(id, { [key]: value });
    },
    [setFilterValue, id],
  );

  const onSkillBoostChange = useCallback(
    (code: string, value: string | boolean) => {
      if (typeof value === "boolean") {
        const next = [...filter.value.skillBoosts];
        if (value) {
          next.push(code);
        } else {
          const idx = next.indexOf(code);
          if (idx !== -1) {
            next.splice(idx, 1);
          }
        }

        setFilterValue(id, { skillBoosts: next });
      }
    },
    [setFilterValue, id, filter.value.skillBoosts],
  );

  const onHealthXChange = useCallback(
    (value: boolean) => {
      setFilterValue(id, { healthX: value });
    },
    [setFilterValue, id],
  );

  return (
    <FilterContainer
      className={css["asset-filter"]}
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={filter.open}
      title="Asset"
    >
      <Combobox
        id="asset-slots"
        items={options.slots}
        label="Slots"
        onValueChange={onChangeSlot}
        placeholder="Select slot(s)..."
        renderItem={renderSlot}
        renderResult={renderSlot}
        selectedItems={filter.value.slots}
        showLabel
      />

      <fieldset className={css["skill-boosts"]}>
        <legend className={css["skill-boosts-label"]}>Skill Boosts</legend>
        {options.skillBoosts.map((skill) => (
          <Checkbox
            checked={filter.value.skillBoosts.includes(skill)}
            id={`asset-skillboost-${skill}`}
            key={skill}
            label={<SkillIcon skill={skill} />}
            onCheckedChange={(val) => onSkillBoostChange(skill, val)}
          />
        ))}
      </fieldset>

      <Combobox
        id="asset-uses"
        items={options.uses}
        label="Uses"
        onValueChange={onChangeUses}
        placeholder="Select Uses attribute(s)..."
        renderItem={capitalizeCode}
        renderResult={capitalizeCode}
        selectedItems={filter.value.uses}
        showLabel
      />

      <RangeSelect
        id="asset-health"
        label="Health"
        max={options.health.max}
        min={options.health.min}
        onValueCommit={(val) => {
          onChangeRange("health", [val[0], val[1]]);
        }}
        showLabel
        value={filter.value.health ?? [options.health.min, options.health.max]}
      />

      <RangeSelect
        id="asset-sanity"
        label="Sanity"
        max={options.sanity.max}
        min={options.sanity.min}
        onValueCommit={(val) => {
          onChangeRange("sanity", [val[0], val[1]]);
        }}
        showLabel
        value={filter.value.sanity ?? [options.sanity.min, options.sanity.max]}
      />

      <Checkbox
        checked={filter.value.healthX}
        id="asset-health-x"
        label='Include health / sanity "X"'
        onCheckedChange={onHealthXChange}
      />
    </FilterContainer>
  );
}
