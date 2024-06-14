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
import { capitalize } from "@/utils/formatting";

import css from "./asset-filter.module.css";
import cssMain from "./filters.module.css";

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
    <span className={cssMain["filter-menu-icon"]}>
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
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onOpenChange = useCallback(() => {
    setFilterOpen(cardType, "asset", !open);
  }, [open, setFilterOpen, cardType]);

  const onReset = useCallback(() => {
    resetFilter(cardType, "asset");
  }, [resetFilter, cardType]);

  const onChangeUses = useCallback(
    (value: string[]) => {
      setNestedFilter(cardType, "asset", "uses", value);
    },
    [setNestedFilter, cardType],
  );

  const onChangeSlot = useCallback(
    (value: string[]) => {
      setNestedFilter(cardType, "asset", "slots", value);
    },
    [setNestedFilter, cardType],
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
    (code: string, value: string | boolean) => {
      if (typeof value === "boolean") {
        const next = [...skillBoostsValue];
        if (value) {
          next.push(code);
        } else {
          const idx = next.indexOf(code);
          if (idx !== -1) {
            next.splice(idx, 1);
          }
        }

        setNestedFilter(cardType, "asset", "skillBoosts", next);
      }
    },
    [setNestedFilter, cardType, skillBoostsValue],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
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
        selectedItems={slotValue}
        showLabel
      />

      <fieldset className={css["skill-boosts"]}>
        <legend className={css["skill-boosts-label"]}>Skill Boosts</legend>
        {options.skillBoosts.map((skill) => (
          <Checkbox
            checked={skillBoostsValue.includes(skill)}
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
        selectedItems={usesValue}
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
        value={healthValue ?? [options.health.min, options.health.max]}
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
        value={sanityValue ?? [options.sanity.min, options.sanity.max]}
      />

      <Checkbox
        checked={healthX}
        id="asset-health-x"
        label="X"
        onCheckedChange={(val) => {
          setNestedFilter(cardType, "asset", "healthX", !!val);
        }}
      />
    </FilterContainer>
  );
}
