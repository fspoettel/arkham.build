import type { DisplayDeck, Groupings } from "@/store/lib/deck-grouping";

import css from "./decklist.module.css";

import { DecklistSection } from "./decklist-section";
import { DecklistSectionGroups } from "./decklist-section-groups";

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
        return group ? (
          <DecklistSection
            key={key}
            layout={key === "main" ? "two_column" : "one_column"}
            target={key as keyof Groupings}
            showTitle={key !== "main"}
            title={LABELS[key]}
          >
            <DecklistSectionGroups
              group={group}
              layout={key === "main" ? "two_column" : "one_column"}
            />
          </DecklistSection>
        ) : null;
      })}
    </div>
  );
}
