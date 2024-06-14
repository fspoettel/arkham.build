import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useStore } from "@/store";
import { isPlayerCard } from "@/store/utils";
import { Card } from "./card";

import css from "./card-list.module.css";
import { useEffect, useRef } from "react";

export function CardList() {
  const virtuoso = useRef<VirtuosoHandle>(null);

  const cards = useStore((state) => {
    console.time("filter_cards");

    const cardType = state.filters.cardType;

    const cards = Object.values(state.metadata.cards).filter((card) =>
      cardType === "player"
        ? isPlayerCard(card) &&
          !card.encounter_code &&
          !card.duplicate_of_code &&
          !card.alternate_of_code
        : !!card.encounter_code,
    );

    console.timeEnd("filter_cards");
    return cards;
  });

  useEffect(() => {
    virtuoso.current?.scrollToIndex(0);
  }, [cards]);

  // TODO: use semantic markup. maybe replace with react-virtual? maybe integrate with radix-scrollarea?
  return (
    <Virtuoso
      className={css["card-list"]}
      data={cards}
      totalCount={cards.length}
      initialTopMostItemIndex={0}
      overscan={5}
      ref={virtuoso}
      itemContent={(_, card) => <Card card={card} />}
    />
  );
}
