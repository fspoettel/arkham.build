import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GroupedVirtuosoHandle, ListRange } from "react-virtuoso";
import { GroupedVirtuoso } from "react-virtuoso";
import { createSelector } from "reselect";

import { useStore } from "@/store";
import type { ListState } from "@/store/selectors/card-list";
import { selectFilteredCards } from "@/store/selectors/card-list";
import type { StoreState } from "@/store/slices";
import { range } from "@/utils/range";

import css from "./card-list.module.css";

import { Scroller } from "../ui/scroll-area";
import { Select } from "../ui/select";
import { Grouphead } from "./Grouphead";
import { ListCard } from "./list-card";

const selector = createSelector(
  (state: StoreState) => state.ui,
  (state) => state.listScrollRestore,
);

function findGroupOffset(data: ListState, code: string): number | undefined {
  const groupIndex = data.groups.findIndex((g) => g.code === code);
  if (groupIndex === -1) return undefined;

  return range(0, groupIndex).reduce((acc, i) => acc + data.groupCounts[i], 0);
}

export function CardList() {
  const data = useStore(selectFilteredCards);

  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  const setListScrollRestore = useStore((state) => state.setListScrollRestore);
  const scrollRestore = useStore(selector);

  const activeRange = useRef<ListRange | undefined>(undefined);
  const activeGroup = useRef<string | undefined>(undefined);

  const onSelectGroup = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      if (!data || !virtuosoRef) return;

      const offset = findGroupOffset(data, evt.target.value);

      if (offset) {
        virtuosoRef.current?.scrollToIndex(offset);
      }
    },
    [data],
  );

  const onScrollStop = useCallback(
    (scrolling: boolean) => {
      if (!scrolling) {
        virtuosoRef.current?.getState((snapshot) => {
          // track scroll restore in list. this will be used to rehydrate the view after navigation.
          setListScrollRestore(snapshot);

          if (!activeRange.current || !data?.groupCounts) return;

          // if there is an active group, figure out which one it is by walking the group counts
          // until we find the one containing the index.
          const groupIndex = activeRange.current.startIndex + 1;
          let sum = 0;
          let i = 0;

          for (const len of data.groupCounts) {
            sum += len;
            if (groupIndex <= sum) {
              break;
            } else {
              i += 1;
            }
          }

          activeGroup.current = data.groups[i].code;
        });
      }
    },
    [setListScrollRestore, data],
  );

  const rangeChanged = useCallback((range: ListRange) => {
    activeRange.current = range;
  }, []);

  useEffect(() => {
    if (activeGroup.current && data) {
      const offset = findGroupOffset(data, activeGroup.current);
      virtuosoRef.current?.scrollToIndex(offset ?? 0);
    } else {
      virtuosoRef.current?.scrollTo({ top: 0 });
    }
  }, [data]);

  //TODO: use semantic markup. maybe integrate with radix-scrollarea?
  return (
    <div className={css["list-container"]}>
      <nav className={css["list-nav"]}>
        <output>{data?.cards.length ?? 0} cards</output>
        {data && (
          <Select
            onChange={onSelectGroup}
            value=""
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
            rangeChanged={rangeChanged}
            ref={virtuosoRef}
            isScrolling={onScrollStop}
            restoreStateFrom={scrollRestore}
          />
        )}
      </Scroller>
    </div>
  );
}
