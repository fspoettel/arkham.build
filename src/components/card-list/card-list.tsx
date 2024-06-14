import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type Props = {
  canShowQuantity?: boolean;
  canEdit?: boolean;
  quantities?: Record<string, number> | null;
};

export function CardList({ canEdit, canShowQuantity, quantities }: Props) {
  const data = useStore(selectFilteredCards);

  const cardCount = useRef<number>(data?.cards.length ?? 0);

  useEffect(() => {
    cardCount.current = data?.cards.length ?? 0;
  }, [data?.cards.length]);

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

      if (offset != null) {
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
          activeGroup.current = findActiveGroup(activeRange.current, data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardCount]);

  const jumpToOptions = useMemo(
    () => [
      { value: "", label: "Jump to..." },
      ...(data?.groups ?? []).map((group) => ({
        value: group.code,
        label: group.name,
      })),
    ],
    [data?.groups],
  );

  return (
    <div className={css["list-container"]}>
      <nav className={css["list-nav"]}>
        <output>{data?.cards.length ?? 0} cards</output>
        {data && (
          <Select onChange={onSelectGroup} value="" options={jumpToOptions} />
        )}
      </nav>

      <Scroller
        ref={setScrollParent as unknown as React.RefObject<HTMLDivElement>}
        className={css["list-scroller"]}
      >
        {data && scrollParent && (
          <GroupedVirtuoso
            key={data.key}
            groupCounts={data.groupCounts}
            customScrollParent={scrollParent}
            groupContent={(index) => (
              <Grouphead grouping={data.groups[index]} />
            )}
            itemContent={(index) => (
              <ListCard
                className={css["list-listcard"]}
                key={data.cards[index].code}
                card={data.cards[index]}
                canShowQuantity={canShowQuantity}
                canEdit={canEdit}
                quantities={quantities}
              />
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

function findGroupOffset(data: ListState, code: string): number | undefined {
  const groupIndex = data.groups.findIndex((g) => g.code === code);
  if (groupIndex === -1) return undefined;

  return range(0, groupIndex).reduce((acc, i) => acc + data.groupCounts[i], 0);
}

function findActiveGroup(
  activeRange: ListRange | undefined,
  data: ListState | undefined,
) {
  if (!activeRange || !data?.groupCounts) return undefined;

  // if there is an active group, figure out which one it is by walking the group counts
  // until we find the one containing the index.
  const groupIndex = activeRange.startIndex + 1;
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

  return data.groups[i].code;
}
