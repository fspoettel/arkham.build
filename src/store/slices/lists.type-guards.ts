import type {
  AssetFilter,
  CostFilter,
  FilterKey,
  FilterObject,
  InvestigatorSkillsFilter,
  LevelFilter,
  OwnershipFilter,
  PropertiesFilter,
  SkillIconsFilter,
  SubtypeFilter,
} from "./lists.types";

export function isActionFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"action"> {
  return !!filter && filter.type === "action";
}

export function isAssetFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"asset"> {
  return !!filter && filter.type === "asset";
}

export function isCostFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"cost"> {
  return !!filter && filter.type === "cost";
}

export function isEncounterSetFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"encounterSet"> {
  return !!filter && filter.type === "encounterSet";
}

export function isFactionFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"faction"> {
  return !!filter && filter.type === "faction";
}

export function isInvestigatorFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"investigator"> {
  return !!filter && filter.type === "investigator";
}

export function isLevelFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"level"> {
  return !!filter && filter.type === "level";
}

export function isOwnershipFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"ownership"> {
  return !!filter && filter.type === "ownership";
}

export function isPackFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"pack"> {
  return !!filter && filter.type === "pack";
}

export function isPropertiesFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"properties"> {
  return !!filter && filter.type === "properties";
}

export function isSkillIconsFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"skillIcons"> {
  return !!filter && filter.type === "skillIcons";
}

export function isSubtypeFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"subtype"> {
  return !!filter && filter.type === "subtype";
}

export function isTabooSetFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"tabooSet"> {
  return !!filter && filter.type === "tabooSet";
}

export function isTypeFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"type"> {
  return !!filter && filter.type === "type";
}

export function isTraitFilterObject(
  filter?: FilterObject<FilterKey>,
): filter is FilterObject<"trait"> {
  return !!filter && filter.type === "trait";
}

export function isAssetFilter(value: unknown): value is AssetFilter {
  return (
    typeof value === "object" &&
    value != null &&
    "skillBoosts" in value &&
    "slots" in value &&
    "uses" in value
  );
}

export function isCostFilter(value: unknown): value is CostFilter {
  return (
    typeof value === "object" &&
    value != null &&
    "range" in value &&
    "even" in value &&
    "odd" in value &&
    "x" in value &&
    "nocost" in value
  );
}

export function isLevelFilter(value: unknown): value is LevelFilter {
  return (
    typeof value === "object" &&
    value != null &&
    "range" in value &&
    "exceptional" in value &&
    "nonexceptional" in value
  );
}

export function isRangeFilter(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((v) => typeof v === "number")
  );
}

export function isMultiSelectFilter(value: unknown): value is string[] {
  return Array.isArray(value);
}

export function isOwnershipFilter(value: unknown): value is OwnershipFilter {
  return value === "all" || value === "owned" || value === "unowned";
}

export function isPropertiesFilter(value: unknown): value is PropertiesFilter {
  return (
    typeof value === "object" &&
    value != null &&
    "fast" in value &&
    Object.values(value).every((v) => typeof v === "boolean")
  );
}

export function isSubtypeFilter(value: unknown): value is SubtypeFilter {
  return (
    typeof value === "object" &&
    value != null &&
    "none" in value &&
    "weakness" in value &&
    "basicweakness" in value
  );
}

export function isSkillIconsFilter(value: unknown): value is SkillIconsFilter {
  return (
    typeof value === "object" &&
    value != null &&
    Object.values(value).every((v) => typeof v === "number" || v == null)
  );
}

export function isInvestigatorSkillsFilter(
  value: unknown,
): value is InvestigatorSkillsFilter {
  return (
    typeof value === "object" &&
    value != null &&
    Object.values(value).every((v) => v == null || isRangeFilter)
  );
}
