import { Card } from "@/store/services/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { or } from "@/utils/fp";

export function filterUses(types: string[], usesTable: LookupTables["uses"]) {
  const filter = or(
    types.map((type) => {
      return (card: Card) => !!usesTable[type]?.[card.code];
    }),
  );

  return (card: Card) => filter(card);
}
