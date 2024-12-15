import type {
  DeckRequirements,
  DeckRestrictions,
  QueryCard,
} from "@/store/services/queries.types";
import type { Metadata } from "../slices/metadata.types";

import localCards from "@/store/services/data/cards.json";
import localCycles from "@/store/services/data/cycles.json";
import localPacks from "@/store/services/data/packs.json";

export function applyLocalData(_metadata: Metadata) {
  const metadata = {
    ..._metadata,
    cards: {
      ..._metadata.cards,
    },
    cycles: {
      ..._metadata.cycles,
    },
    packs: {
      ..._metadata.packs,
    },
  };

  for (const card of localCards) {
    if (card.patch) {
      metadata.cards[card.code] = {
        ...metadata.cards[card.code],
        ...formatLocalCard(card, "patch"),
      };
    } else {
      metadata.cards[card.code] = formatLocalCard(card);
    }
  }

  for (const pack of localPacks) {
    metadata.packs[pack.code] = pack;
  }

  for (const cycle of localCycles) {
    metadata.cycles[cycle.code] = cycle;
  }

  return metadata;
}

export function formatLocalCard(
  // biome-ignore lint/suspicious/noExplicitAny: safe, we control the data.
  card: Record<string, any>,
  mode = "card",
): QueryCard {
  const fullCard = {
    ...card,
    back_link_id: card.back_link,
    id: card.code,
    exceptional: card.text?.includes("Exceptional."),
    myriad: card.text?.includes("Myriad."),
    official: true,
    real_flavor: card.flavor,
    real_name: card.name,
    real_text: card.text,
    real_traits: card.traits,
    real_subname: card.subname,
    real_slot: card.slot,
    real_back_flavor: card.back_flavor,
    real_back_text: card.back_text,
    real_back_name: card.back_name,
    real_back_traits: card.back_traits,
    pack_position: card.position,
    deck_requirements: decodeDeckRequirements(card.deck_requirements),
    restrictions: decodeRestrictions(card.restrictions),
  } as QueryCard;

  return mode === "patch"
    ? (Object.fromEntries(
        Object.entries(fullCard).filter(([_, value]) => value != null),
      ) as QueryCard)
    : fullCard;
}

function decodeRestrictions(str: string): DeckRestrictions | undefined {
  return str?.split(", ").reduce((acc: DeckRestrictions, curr: string) => {
    const key = curr.substring(0, curr.indexOf(":"));
    const val = curr.substring(curr.indexOf(":") + 1);

    if (key === "investigator") {
      acc.investigator ??= {};
      const values = val.split(":");
      for (const val of values) {
        acc.investigator[val] = { [val]: val };
      }
    }

    if (key === "trait") {
      acc.trait ??= [];
      acc.trait.push(val);
    }

    return acc;
  }, {} as DeckRestrictions);
}

function decodeDeckRequirements(str: string): DeckRequirements | undefined {
  return str?.split(", ").reduce((acc: DeckRequirements, curr: string) => {
    const key = curr.substring(0, curr.indexOf(":"));
    const val = curr.substring(curr.indexOf(":") + 1);

    if (key === "size") {
      acc.size = Number.parseInt(val, 10);
    }

    if (key === "random") {
      const [target, value] = val.split(":");
      acc.random ??= [];
      acc.random.push({ target, value });
    }

    if (key === "card") {
      acc.card ??= {};

      const values = val.split(":");

      acc.card[values[0]] = values.reduce<Record<string, string>>(
        (acc, curr) => {
          acc[curr] = curr;
          return acc;
        },
        {},
      );
    }

    return acc;
  }, {} as DeckRequirements);
}
