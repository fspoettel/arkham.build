import {
  createPackCodeBitPositions,
  encodePackCodes,
  type JsonDataCard,
  type JsonDataPack,
} from "@arkham-build/shared";
import type { CanonicalCardPackCodes } from "../../../../db/schema.types.ts";

export function createCanonicalCardPackCodes(
  packs: readonly JsonDataPack[],
  cards: readonly (JsonDataCard & { readonly id: string })[],
  cardResolutions: ReadonlyMap<string, string>,
): CanonicalCardPackCodes[] {
  const bitPositions = createPackCodeBitPositions(packs);
  const packsByCode = new Map(packs.map((pack) => [pack.code, pack]));
  const aggregatePacksByPackCode = new Map<string, JsonDataPack[]>();

  for (const pack of packs) {
    for (const reprintedPackCode of pack.reprint_packs ?? []) {
      const aggregatePacks = aggregatePacksByPackCode.get(reprintedPackCode);

      if (aggregatePacks) {
        aggregatePacks.push(pack);
      } else {
        aggregatePacksByPackCode.set(reprintedPackCode, [pack]);
      }
    }
  }

  const packCodesByCanonicalCardId = new Map<string, Set<string>>();

  for (const card of cards) {
    if (card.taboo_set_id != null) continue;
    if (card.encounter_code != null && (card.deck_limit ?? 0) <= 0) continue;

    const directPack = packsByCode.get(card.pack_code);
    if (!directPack) {
      throw new Error(
        `Card ${card.id} references unknown pack ${card.pack_code}.`,
      );
    }

    const canonicalCardId = cardResolutions.get(card.id) ?? card.id;
    const packCodes =
      packCodesByCanonicalCardId.get(canonicalCardId) ?? new Set<string>();

    packCodes.add(directPack.code);

    for (const aggregatePack of aggregatePacksByPackCode.get(directPack.code) ??
      []) {
      const isEncounterCard = card.encounter_code != null;
      if (
        (aggregatePack.reprint_type === "player" && !isEncounterCard) ||
        (aggregatePack.reprint_type === "campaign" && isEncounterCard)
      ) {
        packCodes.add(aggregatePack.code);
      }
    }

    packCodesByCanonicalCardId.set(canonicalCardId, packCodes);
  }

  return Array.from(
    packCodesByCanonicalCardId,
    ([canonical_card_id, packCodes]) => {
      const hexMask = encodePackCodes(packCodes, bitPositions);
      const pack_codes = Array.from(hexMask, (digit) =>
        Number.parseInt(digit, 16).toString(2).padStart(4, "0"),
      ).join("");

      return { canonical_card_id, pack_codes };
    },
  );
}
