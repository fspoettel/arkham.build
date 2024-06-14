import type { DisplayDeck } from "@/store/lib/deck-grouping";

import css from "./decklist.module.css";

import { DecklistGroups } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";
import { DecklistValidation } from "./decklist-validation";

type Props = {
  deck: DisplayDeck;
};

const LABELS: Record<string, string> = {
  main: "Cards",
  side: "Side deck",
  special: "Special cards",
  bonded: "Bonded cards",
  extra: "Extra deck",
};

export function Decklist({ deck }: Props) {
  const firstCol =
    deck.groups.extra || deck.groups.side ? deck.groups.bonded : null;
  const secondCol = deck.groups.extra || deck.groups.side || deck.groups.bonded;
  const thirdCol = deck.groups.extra ? deck.groups.side : null;

  return (
    <article className={css["decklist-container"]}>
      <header>
        <h1 className={css["decklist-title"]}>{deck.name}</h1>
      </header>

      <DecklistValidation />

      <div className={css["decklist"]}>
        <DecklistSection layout="two_column" title={LABELS["main"]}>
          <DecklistGroups group={deck.groups.main.data} layout="two_column" />
        </DecklistSection>

        <div className={css["decklist-row"]}>
          <div>
            <DecklistSection
              layout="one_column"
              showTitle
              title={LABELS["special"]}
            >
              <DecklistGroups
                group={deck.groups.special.data}
                layout="one_column"
              />
            </DecklistSection>
            {firstCol && (
              <DecklistSection
                layout="one_column"
                showTitle
                title={LABELS[firstCol.id]}
              >
                <DecklistGroups group={firstCol.data} layout="one_column" />
              </DecklistSection>
            )}
          </div>
          {secondCol && (
            <div>
              <DecklistSection
                layout="one_column"
                showTitle
                title={LABELS[secondCol.id]}
              >
                <DecklistGroups group={secondCol.data} layout="one_column" />
              </DecklistSection>
            </div>
          )}
        </div>
        <div className={css["decklist-row"]}>
          {thirdCol && (
            <DecklistSection
              layout="one_column"
              showTitle
              title={LABELS[thirdCol.id]}
            >
              <DecklistGroups group={thirdCol.data} layout="one_column" />
            </DecklistSection>
          )}
        </div>
      </div>
    </article>
  );
}
