import {
  REGEX_WEAKNESS_FACTION_LOCKED,
  SPECIAL_CARD_CODES,
} from "@/utils/constants";
import { isEmpty } from "@/utils/is-empty";
import { randomInt } from "@/utils/random-int";
import type { StoreState } from "../slices";
import { ownedCardCount } from "./card-ownership";
import type { ResolvedDeck } from "./types";

export function randomBasicWeaknessForDeck(
  state: StoreState,
  deck: ResolvedDeck,
) {
  const factionCode = deck.investigatorBack.card.faction_code;

  const limitedPool = deck.cardPool ?? [];
  const useLimitedPool =
    state.settings.useLimitedPoolForWeaknessDraw && !isEmpty(limitedPool);

  const collection = useLimitedPool
    ? limitedPool.reduce<Record<string, number>>((acc, curr) => {
        acc[curr] = state.settings.collection?.[curr] ?? 1;
        return acc;
      }, {})
    : state.settings.collection;

  const basicWeaknesses = Object.keys(
    state.lookupTables.subtypeCode["basicweakness"],
  ).reduce<string[]>((acc, code) => {
    const card = state.metadata.cards[code];

    const ownedCount = ownedCardCount(
      card,
      state.metadata,
      state.lookupTables,
      collection,
      !useLimitedPool && state.settings.showAllCards,
    );

    if (
      card.code === SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS ||
      !!card.duplicate_of_code ||
      ownedCount === 0 ||
      deck.slots[code] >= (card.deck_limit ?? card.quantity)
    ) {
      return acc;
    }

    const factionMatch = REGEX_WEAKNESS_FACTION_LOCKED.exec(
      card.real_text ?? "",
    );

    if (factionMatch && factionMatch[1] !== factionCode) {
      return acc;
    }

    const codes = Array.from({ length: ownedCount }, () => code);
    acc.push(...codes);

    return acc;
  }, []);

  if (!basicWeaknesses.length) return undefined;

  const randomIndex = randomInt(0, basicWeaknesses.length - 1);
  return basicWeaknesses[randomIndex];
}
