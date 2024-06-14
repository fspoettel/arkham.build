import { useStore } from "@/store";
import { isPlayerCard } from "@/store/utils";
import { Card } from "./card";
import { Virtuoso } from "react-virtuoso";

export function CardList() {
  const cards = useStore((state) => {
    console.time("filter_cards");

    const cardType = state.filters.cardType;

    const cards = Object.values(state.metadata.cards).filter((card) =>
      cardType === "player"
        ? isPlayerCard(card) && !card.encounter_code
        : !!card.encounter_code,
    );

    console.timeEnd("filter_cards");
    return cards;
  });

  return (
    <Virtuoso
      data={cards}
      totalCount={cards.length}
      itemContent={(_, card) => <Card card={card} />}
    />
  );
}
