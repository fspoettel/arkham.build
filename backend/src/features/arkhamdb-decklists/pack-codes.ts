import assert from "node:assert/strict";
import { PACK_CODES_BIT_COUNT } from "@arkham-build/shared";

export function decodePackCodes(packCodes: string): string {
  const decoded = Array.from(packCodes, (digit) =>
    Number.parseInt(digit, 16).toString(2).padStart(4, "0"),
  ).join("");

  assert.equal(
    decoded.length,
    PACK_CODES_BIT_COUNT,
    "Decoded pack-code mask must contain 512 bits.",
  );

  return decoded;
}
