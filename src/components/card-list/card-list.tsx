import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";
import { useStore } from "@/store";
import { Card } from "./card";

import css from "./card-list.module.css";
import { GroupHeader } from "./group-header";
import { selectFilteredCards } from "@/store/selectors/card-list";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { range } from "@/utils/range";
import { Select } from "../ui/select";

export function CardList() {
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);
  const data = useStore(selectFilteredCards);

  const onSelectGroup = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      if (!data || !virtuosoRef) return;

      const groupIndex = data.groups.findIndex(
        (g) => g.code === evt.target.value,
      );
      if (groupIndex >= 0) {
        const groupOffset = range(0, groupIndex).reduce(
          (acc, i) => acc + data.groupCounts[i],
          0,
        );
        virtuosoRef.current?.scrollToIndex(groupOffset);
      }
    },
    [data],
  );

  useEffect(() => {
    virtuosoRef.current?.scrollTo({ top: 0 });
  }, [data?.groupCounts]);

  // TODO: restore scroll position to current group?
  // TODO: use semantic markup. maybe integrate with radix-scrollarea?
  return (
    <div className={css["card-list-container"]}>
      <nav className={css["card-list-nav"]}>
        <output>{data?.cards.length ?? 0} cards</output>
        {data && (
          <Select
            onChange={onSelectGroup}
            value=""
            tabIndex={-1}
            options={data.groups.map((group) => ({
              value: group.code,
              label: group.name,
            }))}
          />
        )}
      </nav>
      {data && (
        <GroupedVirtuoso
          className={css["card-list"]}
          key={data.key}
          groupCounts={data.groupCounts}
          groupContent={(index) => (
            <GroupHeader grouping={data.groups[index]} />
          )}
          initialTopMostItemIndex={0}
          itemContent={(index) => (
            <Card key={data.cards[index].code} card={data.cards[index]} />
          )}
          ref={virtuosoRef}
        />
      )}
    </div>
  );
}
