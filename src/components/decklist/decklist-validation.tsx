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
                {isTooManyCardsError(error) && (
                  <>
                    {t("deck.validation.too_many_cards", {
                      deck: `${t(`common.decks.${error.details.target}`)}`,
                    })}{" "}
                    ({error.details.count} / {error.details.countRequired})
                  </>
                )}
                {isTooFewCardsError(error) && (
                  <>
                    {t("deck.validation.too_few_cards", {
                      deck: `${t(`common.decks.${error.details.target}`)}`,
                    })}{" "}
                    ({error.details.count} / {error.details.countRequired})
                  </>
                )}
                {isInvalidInvestigatorError(error) &&
                  t("deck.validation.invalid_investigator")}
                {isDeckOptionsError(error) &&
                  t(`common.deck_options.${error.details.error}`)}
                {isInvalidCardCountError(error) && (
                  <>
                    {t("deck.validation.invalid_card_count")}
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
                    {t("deck.validation.forbidden_cards")}
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
                    {t("deck.validation.investigator_requirements")}
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
