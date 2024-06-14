import type { DisplayDeck, Groupings } from "@/store/lib/deck-grouping";

import css from "./decklist.module.css";

import { DecklistGroups } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";

type Props = {
  deck: DisplayDeck;
};

const LABELS: Record<string, string> = {
  main: "Deck",
  side: "Side deck",
  special: "Special cards",
  bonded: "Bonded cards",
  extra: "Extra deck",
};

export function Decklist({ deck }: Props) {
  return (
    <div className={css["decklist"]}>
      {Object.keys(deck.groups).map((key) => {
        const group = deck.groups[key as keyof Groupings];
        const layout = key === "main" ? "two_column" : "one_column";
        return group ? (
          <DecklistSection
            key={key}
            layout={layout}
            target={key as keyof Groupings}
            showTitle={key !== "main"}
            title={LABELS[key]}
          >
            <DecklistGroups group={group} layout={layout} />
          </DecklistSection>
        ) : null;
      })}
    </div>
  );
}
