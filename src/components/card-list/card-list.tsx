import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";
import { useStore } from "@/store";
import { Card } from "./card";

import css from "./card-list.module.css";
import { GroupHeader } from "./group-header";
import { selectFilteredCards } from "@/store/selectors/card-list";
import { Select, SelectItem } from "../ui/select";
import { useCallback, useEffect, useRef } from "react";
import { range } from "@/utils/range";

export function CardList() {
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);
  const data = useStore(selectFilteredCards);

  const onSelectGroup = useCallback(
    (code: string) => {
      if (!data || !virtuosoRef) return;

      const groupIndex = data.groups.findIndex((g) => g.code === code);
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

  if (!data || !data.cards.length) return null;

  // TODO: restore scroll position to current group?
  // TODO: use semantic markup. maybe integrate with radix-scrollarea?
  return (
    <div className={css["card-list-container"]} key={data.key}>
      <nav className={css["card-list-nav"]}>
        <output>{data?.cards.length ?? 0} cards</output>
        <Select onValueChange={onSelectGroup} placeholder="Jump to..." value="">
          {data.groups.map((group) => (
            <SelectItem value={group.code} key={group.code}>
              {group.name}
            </SelectItem>
          ))}
        </Select>
      </nav>
      <GroupedVirtuoso
        className={css["card-list"]}
        groupCounts={data.groupCounts}
        groupContent={(index) => <GroupHeader grouping={data.groups[index]} />}
        initialTopMostItemIndex={0}
        itemContent={(index) => (
          <Card key={data.cards[index].code} card={data.cards[index]} />
        )}
        ref={virtuosoRef}
      />
    </div>
  );
}
