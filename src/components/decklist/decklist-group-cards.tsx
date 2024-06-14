import type { DeckCard } from "@/store/lib/deck-grouping";

import { ListCard } from "../card-list/list-card";

type Props = {
  cards: DeckCard[];
};

export function DecklistGroupCards({ cards }: Props) {
  return (
    <ol>
      {cards
        .toSorted((a, b) => a.real_name.localeCompare(b.real_name))
        .map((card) => (
          <ListCard
            as="li"
            key={card.code}
            card={card}
            quantity={card.quantity}
            size="sm"
          />
        ))}
    </ol>
  );
}
