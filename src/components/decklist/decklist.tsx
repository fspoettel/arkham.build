import type { DisplayDeck, NamedGrouping } from "@/store/lib/deck-grouping";

import css from "./decklist.module.css";

import { DecklistGroups } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";

const LABELS: Record<string, string> = {
  main: "Cards",
  side: "Side deck",
  special: "Special cards",
  bonded: "Bonded cards",
  extra: "Extra deck",
};

type Props = {
  deck: DisplayDeck;
};

function getSlotsForGrouping(deck: DisplayDeck, grouping: NamedGrouping) {
  if (grouping.id === "side") return deck.sideSlots ?? undefined;
  if (grouping.id === "extra") return deck.extraSlots ?? undefined;
  if (grouping.id === "bonded") return deck.bondedSlots;
  return undefined;
}

export function Decklist({ deck }: Props) {
  const firstCol =
    deck.groups.extra || deck.groups.side ? deck.groups.bonded : null;

  const secondCol = deck.groups.extra || deck.groups.side || deck.groups.bonded;
  const thirdCol = deck.groups.extra ? deck.groups.side : null;

  return (
    <article className={css["decklist-container"]} data-testid="view-decklist">
      <div className={css["decklist"]}>
        <DecklistSection title={LABELS["main"]}>
          <DecklistGroups
            group={deck.groups.main.data}
            ignoredCounts={deck.ignoreDeckLimitSlots ?? undefined}
            layout="two_column"
            mapping="slots"
            ownershipCounts={deck.ownershipCounts}
            quantities={deck.slots}
          />
        </DecklistSection>

        <div className={css["decklist-row"]}>
          <div>
            <DecklistSection showTitle title={LABELS["special"]}>
              <DecklistGroups
                group={deck.groups.special.data}
                ignoredCounts={deck.ignoreDeckLimitSlots ?? undefined}
                layout="one_column"
                mapping="slots"
                ownershipCounts={deck.ownershipCounts}
                quantities={deck.slots}
              />
            </DecklistSection>
            {firstCol && (
              <DecklistSection showTitle title={LABELS[firstCol.id]}>
                <DecklistGroups
                  group={firstCol.data}
                  layout="one_column"
                  mapping={firstCol.id}
                  ownershipCounts={deck.ownershipCounts}
                  quantities={getSlotsForGrouping(deck, firstCol)}
                />
              </DecklistSection>
            )}
          </div>
          {secondCol && (
            <div>
              <DecklistSection showTitle title={LABELS[secondCol.id]}>
                <DecklistGroups
                  group={secondCol.data}
                  layout="one_column"
                  mapping={secondCol.id}
                  ownershipCounts={deck.ownershipCounts}
                  quantities={getSlotsForGrouping(deck, secondCol)}
                />
              </DecklistSection>
            </div>
          )}
        </div>
        <div className={css["decklist-row"]}>
          {thirdCol && (
            <DecklistSection showTitle title={LABELS[thirdCol.id]}>
              <DecklistGroups
                group={thirdCol.data}
                layout="one_column"
                mapping={thirdCol.id}
                ownershipCounts={deck.ownershipCounts}
                quantities={getSlotsForGrouping(deck, thirdCol)}
              />
            </DecklistSection>
          )}
        </div>
      </div>
    </article>
  );
}
