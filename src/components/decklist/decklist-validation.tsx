import { InfoIcon } from "lucide-react";

import {
  type DeckValidationResult,
  isDeckOptionsError,
  isDeckRequirementsNotMetError,
  isForbiddenCardError,
  isInvalidCardCountError,
  isInvalidInvestigatorError,
  isTooFewCardsError,
  isTooManyCardsError,
} from "@/store/lib/deck-validation";

import css from "./decklist-validation.module.css";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";

type Props = {
  defaultOpen?: boolean;
  validation: DeckValidationResult;
};

export function DecklistValidation(props: Props) {
  const { defaultOpen, validation } = props;

  if (validation.valid) return null;

  return (
    <Collapsible
      className={css["decklist-validation"]}
      defaultOpen={defaultOpen}
      title={
        <div className={css["decklist-validation-header"]}>
          <InfoIcon />
          <p className={css["decklist-validation-text"]}>Deck is invalid.</p>
        </div>
      }
    >
      <CollapsibleContent>
        <ul className={css["decklist-validation-results"]}>
          {validation.errors.map((error, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no unique key available.
            <li className={css["decklist-validation-result"]} key={i}>
              {isTooManyCardsError(error) &&
                `${getName(error.details.target)} contains too many cards. (${error.details.count} / ${error.details.countRequired})`}
              {isTooFewCardsError(error) &&
                `${getName(error.details.target)} contains too few cards. (${error.details.count} / ${error.details.countRequired})`}
              {isInvalidInvestigatorError(error) &&
                "Investigator is invalid. Required configuration is missing or the card is not an investigator."}
              {isDeckRequirementsNotMetError(error) &&
                "Deck does not comply with the Investigator requirements."}
              {isDeckOptionsError(error) && error.details.error}
              {isInvalidCardCountError(error) && (
                <>
                  Deck contains invalid number of copies of the following cards:
                  <ol className={css["decklist-validation-result-cards"]}>
                    {error.details.map((detail) => (
                      <li key={detail.code}>
                        {detail.real_name} ({detail.quantity}/{detail.limit})
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {isForbiddenCardError(error) && (
                <>
                  Deck contains forbidden cards (cards not permitted by
                  Investigator):
                  <ol className={css["decklist-validation-result-cards"]}>
                    {error.details.map((detail) => (
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
