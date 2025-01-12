import type { TabooSet } from "@/store/services/queries.types";
import { createSelector } from "reselect";

export function capitalize(s: string | number) {
  const str = s.toString();
  if (!str.length) return str;

  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export function capitalizeWords(s: string) {
  if (!s.length) return s;
  return s.split(" ").map(capitalize).join(" ");
}

export function capitalizeSnakeCase(s: string) {
  if (!s.length) return s;
  return s.split("_").map(capitalize).join(" ");
}

// `toLocaleDateString()` is slow, memoize it.
export const formatDate = createSelector(
  (date: string | number) => date,
  (date) =>
    new Date(date).toLocaleDateString(navigator.language, {
      dateStyle: "medium",
    }),
);

export const formatTabooSet = createSelector(
  (tabooSet: TabooSet) => tabooSet,
  (tabooSet) => {
    const formattedDate = formatDate(tabooSet.date);
    return `${capitalize(tabooSet.name)} (${formattedDate})`;
  },
);

export function formatRelationTitle(id: string) {
  if (id === "base") return "Base investigator";
  if (id === "parallel") return "Parallel investigator";
  if (id === "parallelCards") return "Parallel cards";
  if (id === "requiredCards") return "Signatures";
  if (id === "advanced") return "Advanced signatures";
  if (id === "replacement") return "Replacements";
  if (id === "bound") return "Bound";
  if (id === "bonded") return "Bonded";
  if (id === "restrictedTo") return "Restricted";
  if (id === "level") return "Other levels";
  if (id === "otherSignatures") return "Related signatures";
  if (id === "otherVersions") return "Other versions";
  return id;
}

export function formatXpAvailable(
  xp: number | null,
  adjustment: number | null,
  spent: number | null,
) {
  return (
    <span>
      {xp}
      {!!adjustment &&
        `(${adjustment >= 0 ? "+" : "-"}${Math.abs(adjustment)})`}{" "}
      XP <em>(spent: {spent ?? 0})</em>
    </span>
  );
}

export function formatGroupingType(type: string) {
  switch (type) {
    case "base_upgrades": {
      return "Lvl. 0 <> Upgrades";
    }

    default: {
      return capitalizeSnakeCase(type);
    }
  }
}

export function formatProviderName(name: string) {
  switch (name) {
    case "arkhamdb": {
      return "ArkhamDB";
    }

    default: {
      return capitalize(name);
    }
  }
}
