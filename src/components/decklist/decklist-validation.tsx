import { useStore } from "@/store";
import type {
  DeckOptionsError,
  InvalidCardError,
  TooManyCardsError,
} from "@/store/lib/deck-validation";
import { selectDeckValid } from "@/store/selectors/decks";

import css from "./decklist-validation.module.css";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";

export function DecklistValidation({ defaultOpen }: { defaultOpen?: boolean }) {
  const validation = useStore(selectDeckValid);

  if (validation.valid) return null;

  return (
    <Collapsible
      className={css["decklist-validation"]}
      defaultOpen={defaultOpen}
      title={
        <p className={css["decklist-validation-text"]}>
          <i className="icon-auto_fail" /> Deck is invalid.
        </p>
      }
    >
      <CollapsibleContent>
        <ul className={css["decklist-validation-results"]}>
          {validation.errors.map((error, i) => (
            <li className={css["decklist-validation-result"]} key={i}>
              {error.type === "TOO_MANY_CARDS" &&
                `${getName((error as TooManyCardsError).details.target)} contains too many cards.`}
              {error.type === "TOO_FEW_CARDS" &&
                `${getName((error as TooManyCardsError).details.target)} contains too few cards.`}
              {error.type === "INVALID_INVESTIGATOR" &&
                "Investigator is invalid. Required configuration is missing or the card is not an investigator."}
              {error.type === "DECK_REQUIREMENTS_NOT_MET" &&
                "Deck does not comply with the Investigator requirements."}
              {error.type === "INVALID_DECK_OPTION" &&
                (error as DeckOptionsError).details.error}
              {error.type === "INVALID_CARD_COUNT" && (
                <>
                  Deck contains invalid number of copies of the following cards:
                  <ol className={css["decklist-validation-result-cards"]}>
                    {(error as InvalidCardError).details.map((detail) => (
                      <li key={detail.code}>
                        {detail.real_name} ({detail.quantity}/{detail.limit})
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {error.type === "FORBIDDEN" && (
                <>
                  Deck contains forbidden cards (cards not permitted by
                  Investigator):
                  <ol className={css["decklist-validation-result-cards"]}>
                    {(error as InvalidCardError).details.map((detail) => (
                      <li key={detail.code}>{detail.real_name}</li>
                    ))}
                  </ol>
                </>
              )}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function getName(slot: string) {
  if (slot === "slots") return "Deck";
  if (slot === "extraSlots") return "Spirit deck";
  return slot;
}
