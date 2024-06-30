import {
  REGEX_WEAKNESS_FACTION_LOCKED,
  SPECIAL_CARD_CODES,
} from "@/utils/constants";
import { randomInt } from "@/utils/random-int";
import {
  selectCurrentCardQuantity,
  selectCurrentInvestigatorFactionCode,
} from "../selectors/decks";
import type { StoreState } from "../slices";
import type { Id } from "../slices/data.types";
import { ownedCardCount } from "./card-ownership";

export function randomBasicWeaknessForDeck(state: StoreState, deckId: Id) {
  const factionCode = selectCurrentInvestigatorFactionCode(state, deckId);

  const basicWeaknesses = Object.keys(
    state.lookupTables.subtypeCode["basicweakness"],
  ).reduce<string[]>((acc, code) => {
    const card = state.metadata.cards[code];
    const ownedCount = ownedCardCount(
      card,
      state.metadata,
      state.lookupTables,
      state.settings.collection,
      state.settings.showAllCards,
    );

    if (
      card.code === SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS ||
      !!card.duplicate_of_code ||
      ownedCount === 0 ||
      selectCurrentCardQuantity(state, deckId, code, "slots") >=
        (card.deck_limit ?? card.quantity)
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

  const randomIndex = randomInt(0, basicWeaknesses.length - 1);
  return basicWeaknesses[randomIndex];
}
