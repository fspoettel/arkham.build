import { useStore } from "@/store";
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
import { InfoIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Scroller } from "../ui/scroller";
import css from "./decklist-validation.module.css";

type Props = {
  defaultOpen?: boolean;
  validation: DeckValidationResult;
};

export function DecklistValidation(props: Props) {
  const { defaultOpen, validation } = props;

  const { t } = useTranslation();
  const cards = useStore((state) => state.metadata.cards);

  if (validation.valid) return null;

  return (
    <Collapsible
      className={css["decklist-validation"]}
      data-testid="decklist-validation"
      defaultOpen={defaultOpen}
      title={
        <div className={css["decklist-validation-header"]}>
          <InfoIcon />
          <p className={css["decklist-validation-text"]}>
            {t("deck.validation.invalid")}
          </p>
        </div>
      }
    >
      <CollapsibleContent>
        <Scroller className={css["scroller"]}>
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
                {isDeckOptionsError(error) && error.details.error}
                {isInvalidCardCountError(error) && (
                  <>
                    Deck contains invalid number of copies of the following
                    cards:
                    <ol className={css["decklist-validation-result-cards"]}>
                      {error.details.map((detail) => (
                        <li key={detail.code}>
                          {cards[detail.code].real_name} ({detail.quantity}/
                          {detail.limit})
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
                        <li key={detail.code}>
                          {cards[detail.code].real_name}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
                {isDeckRequirementsNotMetError(error) && (
                  <>
                    Deck does not comply with the Investigator requirements:
                    <ol className={css["decklist-validation-result-cards"]}>
                      {error.details.map((detail) => (
                        <li key={detail.code}>
                          {cards[detail.code].real_name} ({detail.quantity}/
                          {detail.required})
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Scroller>
      </CollapsibleContent>
    </Collapsible>
  );
}

function getName(slot: string) {
  if (slot === "slots") return "Deck";
  if (slot === "extraSlots") return "Spirit deck";
  return slot;
}
