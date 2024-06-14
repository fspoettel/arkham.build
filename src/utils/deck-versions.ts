export const NEW_DECK_VERSION = "0.0";

export function incrementVersion(version?: string): string {
  if (!version) return NEW_DECK_VERSION;

  const parsed = version.split(".");
  if (parsed.length !== 2) return NEW_DECK_VERSION;

  return `${parsed[0]}.${Number(parsed[1]) + 1}`;
}
