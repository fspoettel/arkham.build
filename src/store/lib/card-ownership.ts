import type { Card } from "../services/queries.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";

export function ownedCardCount(
  card: Card,
  metadata: Metadata,
  lookupTables: LookupTables,
  collectionSetting: Record<string, number | boolean>,
) {
  let quantityOwned = 0;

  // direct pack ownership.
  const packOwnership = collectionSetting[card.pack_code];

  if (packOwnership) {
    const packsOwned = typeof packOwnership === "number" ? packOwnership : 1;
    quantityOwned += packsOwned * card.quantity;
  }

  // ownership of the format.
  const pack = metadata.packs[card.pack_code];
  const reprintId = `${pack.cycle_code}${card.encounter_code ? "c" : "p"}`;
  if (collectionSetting[reprintId]) quantityOwned += card.quantity;

  const duplicates = lookupTables.relations.duplicates[card.code];

  // HACK: ownership of the revised core encounters.
  if (!duplicates && pack.cycle_code === "core" && collectionSetting["rcore"]) {
    quantityOwned += 1;
  }

  if (!duplicates) return quantityOwned;

  Object.keys(duplicates).forEach((code) => {
    const duplicate = metadata.cards[code];
    const packCode = duplicate.pack_code;
    if (packCode && collectionSetting[packCode])
      quantityOwned += duplicate.quantity;
  });

  return quantityOwned;
}