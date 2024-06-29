import type { DisplayDeck, NamedGrouping } from "@/store/lib/deck-grouping";

import css from "./decklist.module.css";

import { DecklistGroups } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";

const LABELS: Record<string, string> = {
  main: "Cards",
  side: "Side deck",
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
  const cols = [deck.groups.side, deck.groups.extra, deck.groups.bonded]
    .filter((col) => !!col)
    .map(
      (col) =>
        col && (
          <DecklistSection showTitle title={LABELS[col.id]}>
            <DecklistGroups
              group={col.data}
              layout="one_column"
              mapping={col.id}
              ownershipCounts={deck.ownershipCounts}
              quantities={getSlotsForGrouping(deck, col)}
            />
          </DecklistSection>
        ),
    );

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
            {cols[0]}
            {cols[2]}
          </div>
          <div>{cols[1]}</div>
        </div>
      </div>
    </article>
  );
}
