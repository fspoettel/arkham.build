import { sql, type Transaction } from "kysely";
import type { DB } from "../../../db/schema.types.ts";

export async function refreshDecklistCardPackMasks(
  tx: Transaction<DB>,
): Promise<void> {
  await tx.deleteFrom("slots_pack_mask").execute();
  await sql`
    INSERT INTO slots_pack_mask (decklist_id, is_side_deck, pack_mask)
    SELECT DISTINCT
      deck.id,
      slot_group.is_side_deck,
      masks.pack_codes
    FROM arkhamdb_decklist AS deck
    CROSS JOIN LATERAL (
      VALUES
        (FALSE, deck.slots),
        (TRUE, COALESCE(deck.side_slots, '{}'::jsonb))
    ) AS slot_group(is_side_deck, slots)
    CROSS JOIN LATERAL jsonb_object_keys(slot_group.slots)
      AS deck_card(card_id)
    INNER JOIN canonical_card_pack_codes AS masks
      ON masks.canonical_card_id = resolve_card(deck_card.card_id)
  `.execute(tx);
}
