import type { NamedGrouping } from "@/store/lib/deck-grouping";

import css from "./decklist.module.css";

import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { useCallback } from "react";
import { Attachments } from "../attachments/attachments";
import { DecklistGroups } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";

const LABELS: Record<string, string> = {
  slots: "Cards",
  sideSlots: "Side deck",
  bondedSlots: "Bonded cards",
  extraSlots: "Extra deck",
};

type Props = {
  deck: ResolvedDeck;
};

function getSlotsForGrouping(deck: ResolvedDeck, grouping: NamedGrouping) {
  if (grouping.id === "sideSlots") return deck.sideSlots ?? undefined;
  if (grouping.id === "extraSlots") return deck.extraSlots ?? undefined;
  if (grouping.id === "bondedSlots") return deck.bondedSlots;
  return deck.slots;
}

export function Decklist(props: Props) {
  const { deck } = props;
  const cols = [
    deck.groups.sideSlots,
    deck.groups.extraSlots,
    deck.groups.bondedSlots,
  ]
    .filter((col) => !!col)
    .map(
      (col) =>
        col && (
          <DecklistSection showTitle title={LABELS[col.id]}>
            <DecklistGroups
              group={col.data}
              layout="one_column"
              mapping={col.id}
              quantities={getSlotsForGrouping(deck, col)}
            />
          </DecklistSection>
        ),
    );

  const renderCardExtra = useCallback(
    (card: Card) => <Attachments card={card} resolvedDeck={deck} />,
    [deck],
  );

  return (
    <article className={css["decklist-container"]} data-testid="view-decklist">
      <div className={css["decklist"]}>
        <DecklistSection title={LABELS["main"]}>
          <DecklistGroups
            group={deck.groups.slots.data}
            ignoredCounts={deck.ignoreDeckLimitSlots ?? undefined}
            layout="two_column"
            mapping="slots"
            quantities={deck.slots}
            renderCardExtra={renderCardExtra}
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
