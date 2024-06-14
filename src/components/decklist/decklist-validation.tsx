import { useStore } from "@/store";
import type {
  DeckOptionsError,
  InvalidCardError,
} from "@/store/lib/deck-validation";
import { selectDeckValid } from "@/store/selectors/decks";

import css from "./decklist.module.css";

export function DecklistValidation() {
  const validation = useStore(selectDeckValid);

  if (validation.valid) return null;

  return (
    <div className={css["decklist-validation"]}>
      <p className={css["decklist-validation-text"]}>
        <i className="icon-auto_fail" /> Deck is invalid.
      </p>
      <ul className={css["decklist-validation-results"]}>
        {validation.errors.map((error, i) => (
          <li key={i} className={css["decklist-validation-result"]}>
            {error.type === "TOO_MANY_CARDS" && "Contains too many cards."}
            {error.type === "TOO_FEW_CARDS" && "Contains too few cards."}
            {error.type === "INVALID_INVESTIGATOR" &&
              "Investigator unknown or invalid."}
            {error.type === "DECK_REQUIREMENTS_NOT_MET" &&
              "Does not comply with the Investigator requirements."}
            {error.type === "FORBIDDEN" &&
              "Contains forbidden cards (cards not permitted by Investigator)"}
            {error.type === "INVALID_DECK_OPTION" &&
              (error as DeckOptionsError).details.error}
            {error.type === "INVALID_CARD_COUNT" && (
              <>
                Contains invalid number of copies of the following cards:
                <ol className={css["decklist-validation-result-cards"]}>
                  {(error as InvalidCardError).details.map((detail) => (
                    <li key={detail.code}>
                      {detail.real_name} ({detail.quantity}/{detail.limit})
                    </li>
                  ))}
                </ol>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
