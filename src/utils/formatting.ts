import type { TabooSet } from "@/store/services/types";

export function capitalize(s: string | number) {
  s = s.toString();
  if (!s.length) return s;
  return `${s[0].toUpperCase()}${s.slice(1)}`;
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
