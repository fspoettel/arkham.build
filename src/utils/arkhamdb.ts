import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { Deck, DeckProblem } from "@/store/slices/data.types";

export function redirectArkhamDBLinks(evt: React.MouseEvent) {
  evt.preventDefault();
  if (evt.target instanceof HTMLAnchorElement) {
    const href = evt.target.getAttribute("href");
    if (!href) return;

    const url = href.startsWith("/") ? `https://arkhamdb.com${href}` : href;

    window.open(url, "_blank");
  }
}

export function mapValidationToProblem(
  validation: DeckValidationResult,
): DeckProblem | null {
  if (validation.valid) return null;

  const error = validation.errors[0];
  if (!error) return null;

  switch (error.type) {
    case "TOO_FEW_CARDS":
      return "too_few_cards";
    case "TOO_MANY_CARDS":
      return "too_many_cards";
    case "INVALID_CARD_COUNT":
      return "too_many_copies";
    case "INVALID_DECK_OPTION":
      return "deck_options_limit";
    case "FORBIDDEN":
      return "invalid_cards";
    default:
      return "investigator";
  }
}

export function formatDeckExport(
  _deck: Deck,
  validationResult: DeckValidationResult,
): Deck {
  const deck = structuredClone(_deck);
  deck.problem = mapValidationToProblem(validationResult);
  deck.source = undefined;
  return deck;
}
