import type { TabooSet } from "@/store/services/queries.types";
import { createSelector } from "reselect";

export function capitalize(s: string | number) {
  const str = s.toString();
  if (!str.length) return str;

  return str
    .split(" ")
    .map((word) => {
      return `${word[0].toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
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

export function formatTimeAgo(date: Date) {
  const formatter = new Intl.RelativeTimeFormat("en");

  const ranges = [
    ["years", 3600 * 24 * 365],
    ["months", 3600 * 24 * 30],
    ["weeks", 3600 * 24 * 7],
    ["days", 3600 * 24],
    ["hours", 3600],
    ["minutes", 60],
    ["seconds", 1],
  ] as const;

  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const [rangeType, rangeVal] of ranges) {
    if (rangeVal < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / rangeVal;
      return formatter.format(Math.round(delta), rangeType);
    }
  }
}
