import type { Card } from "@/store/services/types";
import type { LookupTables } from "@/store/slices/lookup-tables/types";
import { or } from "@/utils/fp";

export function filterUses(types: string[], usesTable: LookupTables["uses"]) {
  const filter = or(
    types.map((type) => {
      return (card: Card) => !!usesTable[type]?.[card.code];
    }),
  );

  return (card: Card) => filter(card);
}
