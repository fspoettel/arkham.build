import type { Deck, DeckMutablePayload } from "@arkham-build/shared";
import { HTTPException } from "hono/http-exception";

export function calculateDeckUpgradeXp(
  current: Deck,
  desired: DeckMutablePayload,
) {
  if (desired.investigator_code !== current.investigator_code) {
    throw new HTTPException(400, {
      message:
        "An upgraded deck must keep the parent's investigator. If you are trying to apply a transform like Lost Homunculus, use  `meta.transform_into`.",
    });
  }

  const carryoverXp =
    (current.xp ?? 0) + (current.xp_adjustment ?? 0) - (current.xp_spent ?? 0);
  const desiredXp = desired.xp ?? 0;

  if (desiredXp < carryoverXp) {
    throw new HTTPException(400, {
      message: `Upgraded deck XP cannot be less than the parent's ${String(carryoverXp)} carry-over XP`,
    });
  }

  return desiredXp - carryoverXp;
}
