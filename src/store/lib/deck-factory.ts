import type { Deck } from "@/store/slices/data.types";
import { randomId } from "@/utils/crypto";

type Payload = {
  investigator_code: string;
  investigator_name: string;
  name: string;
  slots: Record<string, number>;
} & Partial<Omit<Deck, "id" | "date_creation" | "date_update">>;

export function createDeck(values: Payload): Deck {
  const timestamp = new Date().toISOString();

  return {
    id: randomId(),
    date_creation: timestamp,
    date_update: timestamp,
    description_md: "",
    meta: "",
    ignoreDeckLimitSlots: {},
    sideSlots: {},
    next_deck: null,
    previous_deck: null,
    tags: "",
    version: "0.1",
    taboo_id: null,
    xp: null,
    xp_spent: null,
    exile_string: null,
    xp_adjustment: null,
    ...values,
  };
}

export function getDefaultDeckName(name: string, faction: string) {
  switch (faction) {
    case "guardian":
      return `The Adventures of ${name}`;

    case "seeker":
      return `${name} Investigates`;

    case "rogue":
      return `The ${name} Job`;

    case "mystic":
      return `The ${name} Mysteries`;

    case "survivor":
      return `${name} on the Road`;

    default:
      return `${name} Does It All`;
  }
}

export function cloneDeck(deck: Deck): Deck {
  const now = new Date().toISOString();

  return {
    ...structuredClone(deck),
    id: randomId(),
    name: `(Copy) ${deck.name}`,
    date_creation: now,
    date_update: now,
    exile_string: null,
    next_deck: null,
    previous_deck: null,
    version: "0.1",
    source: undefined,
    xp: null,
    xp_adjustment: null,
    xp_spent: null,
  };
}
