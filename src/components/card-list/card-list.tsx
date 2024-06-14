import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";
import { useStore } from "@/store";
import { Card } from "./card";

import css from "./card-list.module.css";
import { useEffect, useRef } from "react";
import { selectFilteredCards } from "@/store/selectors";
import { GroupHeader } from "./group-header";

export function CardList() {
  const virtuoso = useRef<VirtuosoHandle>(null);

  const data = useStore(selectFilteredCards);

  useEffect(() => {
    virtuoso.current?.scrollToIndex(0);
  }, [data]);

  if (data == null) return null;

  // TODO: use semantic markup. maybe integrate with radix-scrollarea?
  return (
    <GroupedVirtuoso
      className={css["card-list"]}
      groupCounts={data.groupCounts}
      groupContent={(index) => <GroupHeader set={data.groups[index]} />}
      initialTopMostItemIndex={0}
      overscan={5}
      ref={virtuoso}
      itemContent={(index) => <Card card={data.cards[index]} />}
    />
  );
}
