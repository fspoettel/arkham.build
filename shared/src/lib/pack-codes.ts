import { z } from "zod";
import type { JsonDataPack } from "../schemas/pack.schema.ts";

export const PACK_CODES_BIT_COUNT = 512;
export const PACK_CODES_HEX_LENGTH = PACK_CODES_BIT_COUNT / 4;

export const PackCodesSchema = z.string().regex(/^[0-9a-fA-F]{128}$/);

export function comparePacksByReleaseDate(
  a: Pick<JsonDataPack, "code" | "date_release">,
  b: Pick<JsonDataPack, "code" | "date_release">,
) {
  if (!a.date_release) throw new Error(`Pack ${a.code} has no release date.`);
  if (!b.date_release) throw new Error(`Pack ${b.code} has no release date.`);
  if (a.date_release < b.date_release) return -1;
  if (a.date_release > b.date_release) return 1;
  if (a.code < b.code) return -1;
  if (a.code > b.code) return 1;
  return 0;
}

export function sortPacksByReleaseDate<
  T extends Pick<JsonDataPack, "code" | "date_release">,
>(packs: readonly T[]) {
  return [...packs].sort(comparePacksByReleaseDate);
}

export function createPackCodeBitPositions(
  packs: readonly Pick<JsonDataPack, "code" | "date_release">[],
): ReadonlyMap<string, number> {
  if (packs.length > PACK_CODES_BIT_COUNT) {
    throw new RangeError(
      `Cannot assign ${packs.length} packs to a ${PACK_CODES_BIT_COUNT}-bit mask.`,
    );
  }

  const bitPositions = new Map<string, number>();

  for (const [position, pack] of sortPacksByReleaseDate(packs).entries()) {
    if (bitPositions.has(pack.code)) {
      throw new Error(`Duplicate pack code: ${pack.code}.`);
    }

    bitPositions.set(pack.code, position);
  }

  return bitPositions;
}

export function encodePackCodes(
  packCodes: Iterable<string>,
  bitPositions: ReadonlyMap<string, number>,
): string {
  let mask = 0n;

  for (const packCode of packCodes) {
    const position = bitPositions.get(packCode);
    if (position == null) throw new Error(`Unknown pack code: ${packCode}.`);

    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position >= PACK_CODES_BIT_COUNT
    ) {
      throw new RangeError(`Invalid bit position for pack ${packCode}.`);
    }

    mask |= 1n << BigInt(PACK_CODES_BIT_COUNT - position - 1);
  }

  return mask.toString(16).padStart(PACK_CODES_HEX_LENGTH, "0");
}

/** Return set bit positions in ascending PostgreSQL bit-string order. */
export function decodePackCodeMask(mask: string): readonly number[] {
  PackCodesSchema.parse(mask);

  const bitPositions: number[] = [];

  for (const [hexPosition, digit] of Array.from(mask).entries()) {
    const value = Number.parseInt(digit, 16);

    for (let offset = 0; offset < 4; offset += 1) {
      if ((value & (1 << (3 - offset))) !== 0) {
        bitPositions.push(hexPosition * 4 + offset);
      }
    }
  }

  return Object.freeze(bitPositions);
}
