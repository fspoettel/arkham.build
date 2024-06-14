import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GroupedVirtuosoHandle, ListRange } from "react-virtuoso";
import { GroupedVirtuoso } from "react-virtuoso";

import { useStore } from "@/store";
import type { ListState } from "@/store/selectors/card-list";
import { selectFilteredCards } from "@/store/selectors/card-list";
import { range } from "@/utils/range";

import css from "./card-list.module.css";

import { ListCard } from "../list-card/list-card";
import { Scroller } from "../ui/scroller";
import { Select } from "../ui/select";
import { Grouphead } from "./Grouphead";

type Props = {
  quantities?: {
    [code: string]: number;
  };
};

export function CardList(props: Props) {
  const data = useStore(selectFilteredCards);
  const search = useStore((state) => state.search.value);

  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  const activeRange = useRef<ListRange | undefined>(undefined);
  const activeGroup = useRef<string | undefined>(undefined);

  const onSelectGroup = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (!data || !virtuosoRef) return;

      const offset = findGroupOffset(data, evt.target.value);

      if (offset != null) {
        virtuosoRef.current?.scrollToIndex(offset);
      } else {
        virtuosoRef.current?.scrollToIndex(0);
      }
    },
    [data],
  );

  const onScrollStop = useCallback(
    (scrolling: boolean) => {
      if (!scrolling) {
        virtuosoRef.current?.getState(() => {
          activeGroup.current = findActiveGroup(activeRange.current, data);
        });
      }
    },
    [data],
  );

  const rangeChanged = useCallback((range: ListRange) => {
    activeRange.current = range;
  }, []);

  useEffect(() => {
    activeGroup.current = undefined;
    activeRange.current = undefined;
    virtuosoRef.current?.scrollTo({ top: 0 });
  }, [search]);

  useEffect(() => {
    if (activeGroup.current) {
      const offset = findGroupOffset(data, activeGroup.current);
      virtuosoRef.current?.scrollToIndex(offset ?? 0);
    } else {
      virtuosoRef.current?.scrollTo({ top: 0 });
    }
    // HACK: this makes sure this only triggers when the list actually updates, not e.g. when quantities change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.cards.length]);

  const jumpToOptions = useMemo(
    () =>
      (data?.groups ?? []).map((group, i) => ({
        value: group.code,
        label: `${group.name} (${data?.groupCounts[i]})`,
      })),
    [data?.groups, data?.groupCounts],
  );

  return (
    <div className={css["container"]}>
      <nav className={css["nav"]}>
        <output>{data?.cards.length ?? 0} cards</output>
        {data && (
          <Select
            emptyLabel="Jump to..."
            onChange={onSelectGroup}
            options={jumpToOptions}
            value=""
          />
        )}
      </nav>

      <Scroller
        className={css["scroller"]}
        ref={setScrollParent as unknown as React.RefObject<HTMLDivElement>}
      >
        {data && scrollParent && (
          <GroupedVirtuoso
            customScrollParent={scrollParent}
            groupContent={(index) => (
              <Grouphead grouping={data.groups[index]} />
            )}
            groupCounts={data.groupCounts}
            isScrolling={onScrollStop}
            itemContent={(index) => (
              <ListCard
                {...props}
                card={data.cards[index]}
                key={data.cards[index].code}
              />
            )}
            key={data.key}
            rangeChanged={rangeChanged}
            ref={virtuosoRef}
          />
        )}
      </Scroller>
    </div>
  );
}

function findGroupOffset(
  data: ListState | undefined,
  code: string,
): number | undefined {
  if (!data) return undefined;

  const groupIndex = data.groups.findIndex((g) => g.code === code);
  if (groupIndex === -1) return undefined;

  return range(0, groupIndex).reduce((acc, i) => acc + data.groupCounts[i], 0);
}

function findActiveGroup(
  activeRange: ListRange | undefined,
  data: ListState | undefined,
) {
  if (!activeRange || !data?.groupCounts || !data.groups.length)
    return undefined;

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
