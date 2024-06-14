import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectAssetChanges,
  selectAssetHealthValue,
  selectAssetHealthXValue,
  selectAssetOptions,
  selectAssetSanityValue,
  selectAssetSkillBoostsValue,
  selectAssetSlotValue,
  selectAssetUsesValue,
  selectFilterOpen,
} from "@/store/selectors/filters";
import type { Coded } from "@/store/services/types";
import type { AssetFilter } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/capitalize";

import css from "./asset-filter.module.css";

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
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
    >
      <SlotIcon code={c.code} /> {c.code}
    </span>
  );
}

export function AssetFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectAssetChanges);
  const open = useStore(selectFilterOpen(cardType, "asset"));
  const options = useStore(selectAssetOptions);
  const usesValue = useStore(selectAssetUsesValue);
  const slotValue = useStore(selectAssetSlotValue);
  const healthValue = useStore(selectAssetHealthValue);
  const healthX = useStore(selectAssetHealthXValue);
  const sanityValue = useStore(selectAssetSanityValue);
  const skillBoostsValue = useStore(selectAssetSkillBoostsValue);

  const setNestedFilter = useStore((state) => state.setNestedFilter);
  const setDeepNestedFilter = useStore((state) => state.setDeepNestedFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onOpenChange = useCallback(() => {
    setFilterOpen(cardType, "asset", !open);
  }, [open, setFilterOpen, cardType]);

  const onReset = useCallback(() => {
    resetFilter(cardType, "asset");
  }, [resetFilter, cardType]);

  const onChangeUses = useCallback(
    (code: string, value: boolean) => {
      setDeepNestedFilter(cardType, "asset", code, value, "uses");
    },
    [setDeepNestedFilter, cardType],
  );

  const onChangeSlot = useCallback(
    (code: string, value: boolean) => {
      setDeepNestedFilter(cardType, "asset", code, value, "slots");
    },
    [setDeepNestedFilter, cardType],
  );

  const onChangeRange = useCallback(
    function setValue<K extends keyof AssetFilter["value"]>(
      key: K,
      value: AssetFilter["value"][K],
    ) {
      setNestedFilter(cardType, "asset", key, value);
    },
    [setNestedFilter, cardType],
  );

  const onSkillBoostChange = useCallback(
    (code: string, value: boolean | string) => {
      setDeepNestedFilter(cardType, "asset", code, !!value, "skillBoosts");
    },
    [setDeepNestedFilter, cardType],
  );

  return (
    <FilterContainer
      filterString={changes}
      title="Asset"
      open={open}
      onOpenChange={onOpenChange}
      onReset={onReset}
    >
      <Combobox
        label="Slots"
        items={options.slots}
        id="asset-slots"
        showLabel
        renderItem={renderSlot}
        renderResult={renderSlot}
        onSelectItem={onChangeSlot}
        placeholder="Select slot(s)..."
        selectedItems={slotValue}
      />

      <fieldset className={css["skill-boosts"]}>
        <legend className={css["skill-boosts-label"]}>Skill Boosts</legend>
        {options.skillBoosts.map((skill) => (
          <Checkbox
            checked={skillBoostsValue[skill]}
            onCheckedChange={(val) => onSkillBoostChange(skill, val)}
            id={`asset-skillboost-${skill}`}
            label={<SkillIcon skill={skill} />}
            key={skill}
          />
        ))}
      </fieldset>

      <Combobox
        label="Uses"
        items={options.uses}
        id="asset-uses"
        showLabel
        renderItem={capitalizeCode}
        renderResult={capitalizeCode}
        onSelectItem={onChangeUses}
        placeholder="Select Uses attribute(s)..."
        selectedItems={usesValue}
      />

      <RangeSelect
        id="asset-health"
        label="Health"
        showLabel
        min={options.health.min}
        max={options.health.max}
        onValueCommit={(val) => {
          onChangeRange("health", [val[0], val[1]]);
        }}
        value={healthValue ?? [options.health.min, options.health.max]}
      />

      <RangeSelect
        id="asset-sanity"
        label="Sanity"
        showLabel
        min={options.sanity.min}
        max={options.sanity.max}
        onValueCommit={(val) => {
          onChangeRange("sanity", [val[0], val[1]]);
        }}
        value={sanityValue ?? [options.sanity.min, options.sanity.max]}
      />

      <Checkbox
        id="asset-health-x"
        label="X"
        checked={healthX}
        onCheckedChange={(val) => {
          setNestedFilter(cardType, "asset", "healthX", !!val);
        }}
      />
    </FilterContainer>
  );
}
