import { Card } from "../../graphql/types";
import { LookupTables } from "../../slices/lookup-tables/types";

export function sortAlphabetically(lookupTables: LookupTables) {
  return (a: Card, b: Card) => {
    if (a.real_name === b.real_name) {
      if (a.xp === b.xp) {
        return +(a.parallel ?? false) - +(b.parallel ?? false);
      }

      return (a.xp ?? 0) - (b.xp ?? 0);
    }

    return (
      lookupTables.sort.alphabetical[a.code] -
      lookupTables.sort.alphabetical[b.code]
    );
  };
}

export function sortByEncounterPosition(a: Card, b: Card) {
  return (a.encounter_position ?? 0) - (b.encounter_position ?? 0);
}
