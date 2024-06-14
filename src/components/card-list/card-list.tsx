import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

import { useStore } from "@/store";
import { selectFilteredCards } from "@/store/selectors/card-list";
import { range } from "@/utils/range";

import css from "./card-list.module.css";

import { Scroller } from "../ui/scroll-area";
import { Select } from "../ui/select";
import { Grouphead } from "./Grouphead";
import { ListCard } from "./list-card";

export function CardList() {
  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();
  const [rendered, setRendered] = useState(false);
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);
  const data = useStore(selectFilteredCards);

  const setListScrollRestore = useStore((state) => state.setListScrollRestore);
  const scrollRestore = useStore((state) => state.ui.listScrollRestore);

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

  const onScrollStop = useCallback(
    (scrolling: boolean) => {
      if (!scrolling) {
        virtuosoRef.current?.getState((snapshot) => {
          setListScrollRestore(snapshot);
        });
      }
    },
    [setListScrollRestore],
  );

  useEffect(() => {
    setRendered(true);
  }, []);

  useEffect(() => {
    virtuosoRef.current?.scrollTo({ top: 0 });
  }, [data?.groupCounts]);

  // TODO: - restore scroll position to current group?
  //       - use semantic markup. maybe integrate with radix-scrollarea?
  return (
    <div className={css["list-container"]}>
      <nav className={css["list-nav"]}>
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Scroller ref={setScrollParent as any} className={css["list-scroller"]}>
        {data && scrollParent && (
          <GroupedVirtuoso
            key={data.key}
            groupCounts={data.groupCounts}
            customScrollParent={scrollParent}
            groupContent={(index) => (
              <Grouphead grouping={data.groups[index]} />
            )}
            itemContent={(index) => (
              <ListCard key={data.cards[index].code} card={data.cards[index]} />
            )}
            ref={virtuosoRef}
            isScrolling={onScrollStop}
            restoreStateFrom={!rendered ? scrollRestore : undefined}
          />
        )}
      </Scroller>
    </div>
  );
}
