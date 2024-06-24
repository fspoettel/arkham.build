import type { TabooSet } from "@/store/services/queries.types";

export function capitalize(s: string | number) {
  const str = s.toString();
  if (!str.length) return str;
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export function formatTabooSet(tabooSet: TabooSet) {
  const formattedDate = new Date(tabooSet.date).toLocaleDateString(
    navigator.language,
    {
      dateStyle: "medium",
    },
  );

  return `${capitalize(tabooSet.name)} (${formattedDate})`;
}

export function formatSelectionId(id: string) {
  return id.split("_").map(capitalize).join(" ");
}

export function formatRelationTitle(id: string) {
  if (id === "parallel") return "Parallel investigator";
  if (id === "parallelCards") return "Parallel cards";
  if (id === "requiredCards") return "Signatures";
  if (id === "advanced") return "Advanced signatures";
  if (id === "replacement") return "Replacements";
  if (id === "bound") return "Bound";
  if (id === "bonded") return "Bonded";
  if (id === "restrictedTo") return "Restricted";
  if (id === "level") return "Other levels";
  return id;
}
