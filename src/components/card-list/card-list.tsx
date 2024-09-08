import { useCallback, useEffect, useRef, useState } from "react";
import type { GroupedVirtuosoHandle, ListRange } from "react-virtuoso";
import { GroupedVirtuoso } from "react-virtuoso";

import { CenterLayout } from "@/layouts/center-layout";
import { useStore } from "@/store";
import type { ListState } from "@/store/selectors/card-list";
import { selectListCards } from "@/store/selectors/card-list";
import { selectActiveListSearch } from "@/store/selectors/lists";
import { selectActiveList } from "@/store/selectors/lists";
import {
  selectCanCheckOwnership,
  selectCardOwnedCount,
} from "@/store/selectors/shared";
import type { Slots } from "@/store/slices/data.types";
import { range } from "@/utils/range";

import css from "./card-list.module.css";

import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { useCardModalContext } from "../card-modal/card-modal-context";
import { Footer } from "../footer";
import { ListCard, type Props as ListCardProps } from "../list-card/list-card";
import { Scroller } from "../ui/scroller";
import { Grouphead } from "./Grouphead";
import { CardListNav } from "./card-list-nav";
import { CardSearch } from "./card-search";

type Props = {
  className?: string;
  onChangeCardQuantity?: ListCardProps["onChangeCardQuantity"];
  quantities?: Slots;
  listcardSize?: ListCardProps["size"];
  renderListCardAction?: ListCardProps["renderAction"];
  renderListCardAfter?: ListCardProps["renderAfter"];
  renderListCardExtra?: ListCardProps["renderExtra"];
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
  targetDeck?: "slots" | "extraSlots" | "both";
};

export function CardList(props: Props) {
  const {
    className,
    listcardSize,
    onChangeCardQuantity,
    quantities,
    renderListCardAction,
    renderListCardAfter,
    renderListCardExtra,
    slotLeft,
    slotRight,
    targetDeck = "slots",
  } = props;

  const modalContext = useCardModalContext();
  const ctx = useResolvedDeck();

  const data = useStore((state) =>
    selectListCards(state, ctx.resolvedDeck, targetDeck),
  );

  const search = useStore(selectActiveListSearch);
  const metadata = useStore((state) => state.metadata);

  const showCardText = useStore(
    (state) => selectActiveList(state)?.display.showCardText ?? false,
  );

  const setShowCardText = useStore((state) => state.setShowCardText);

  const [currentTop, setCurrentTop] = useState<number>(-1);
  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();

  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);
  const activeRange = useRef<ListRange | undefined>(undefined);
  const activeGroup = useRef<string | undefined>(undefined);
  const canCheckOwnerhip = useStore(selectCanCheckOwnership);
  const cardOwnedCount = useStore(selectCardOwnedCount);

  const onScrollChange = useCallback(() => {
    setCurrentTop(-1);
  }, []);

  useEffect(() => {
    scrollParent?.addEventListener("wheel", onScrollChange, { passive: true });
    return () => {
      scrollParent?.removeEventListener("wheel", onScrollChange);
    };
  }, [scrollParent, onScrollChange]);

  const onSelectGroup = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (
        data &&
        virtuosoRef.current &&
        evt.target instanceof HTMLSelectElement
      ) {
        const offset = findGroupOffset(data, evt.target.value);
        if (offset != null) {
          virtuosoRef.current?.scrollToIndex(offset);
        } else {
          virtuosoRef.current?.scrollToIndex(0);
        }
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

  const onKeyboardNavigate = useCallback(
    (evt: React.KeyboardEvent) => {
      if (!data?.cards.length) return;

      if (evt.key === "ArrowUp" || evt.key === "ArrowDown") {
        evt.preventDefault();

        const keyboardIdx = activeRange.current?.startIndex
          ? Math.max(activeRange.current?.startIndex, currentTop)
          : currentTop;

        const idx =
          evt.key === "ArrowUp"
            ? Math.max(keyboardIdx - 1, 0)
            : Math.min(keyboardIdx + 1, data.cards.length - 1);

        setCurrentTop(idx);

        if (
          !activeRange.current ||
          (activeRange.current &&
            (idx >= activeRange.current.endIndex ||
              idx <= activeRange.current.startIndex))
        ) {
          virtuosoRef.current?.scrollToIndex(idx);
        }
      }

      if (evt.key === "Enter" && currentTop > -1) {
        evt.preventDefault();
        modalContext.setOpen({
          code: data.cards[currentTop].code,
        });
      }

      if (evt.key === "Escape") {
        evt.preventDefault();
        setCurrentTop(-1);
        (evt.target as HTMLInputElement)?.blur();
      }
    },
    [data, currentTop, modalContext],
  );

  const rangeChanged = useCallback((range: ListRange) => {
    activeRange.current = range;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a search should reset scroll position.
  useEffect(() => {
    setCurrentTop(-1);
    activeGroup.current = undefined;
    activeRange.current = undefined;
    virtuosoRef.current?.scrollToIndex(0);
  }, [search]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a change to card count should reset scroll position.
  useEffect(() => {
    if (activeGroup.current) {
      const offset = findGroupOffset(data, activeGroup.current);
      virtuosoRef.current?.scrollToIndex(offset ?? 0);
    } else {
      virtuosoRef.current?.scrollToIndex(0);
    }
  }, [data?.cards.length]);

  return (
    <CenterLayout
      className={className}
      top={
        <CardSearch
          onKeyboardNavigate={onKeyboardNavigate}
          slotLeft={slotLeft}
          slotRight={slotRight}
        />
      }
    >
      <div className={css["container"]}>
        <CardListNav
          deck={ctx.resolvedDeck}
          data={data}
          metadata={metadata}
          onChangeShowCardText={setShowCardText}
          onSelectGroup={onSelectGroup}
          showCardText={showCardText}
        />

        <Scroller
          className={css["scroller"]}
          data-testid="card-list-scroller"
          ref={setScrollParent as unknown as React.RefObject<HTMLDivElement>}
        >
          {data && scrollParent && (
            <GroupedVirtuoso
              context={{ currentTop }}
              customScrollParent={scrollParent}
              groupContent={(index) => (
                <Grouphead
                  grouping={data.groups[index]}
                  metadata={metadata}
                  variant={showCardText ? "alt" : undefined}
                />
              )}
              groupCounts={data.groupCounts}
              isScrolling={onScrollStop}
              itemContent={(index, _, __, { currentTop }) => (
                <ListCard
                  card={data.cards[index]}
                  disableKeyboard
                  isActive={index === currentTop}
                  key={data.cards[index].code}
                  onChangeCardQuantity={onChangeCardQuantity}
                  ownedCount={
                    canCheckOwnerhip
                      ? cardOwnedCount(data.cards[index])
                      : undefined
                  }
                  quantity={
                    quantities
                      ? quantities[data.cards[index].code] ?? 0
                      : undefined
                  }
                  renderAfter={renderListCardAfter}
                  renderAction={renderListCardAction}
                  renderExtra={renderListCardExtra}
                  size={listcardSize}
                  showCardText={showCardText}
                />
              )}
              key={`${data.key}-${showCardText}`}
              rangeChanged={rangeChanged}
              ref={virtuosoRef}
            />
          )}
        </Scroller>
        <Footer />
      </div>
    </CenterLayout>
  );
}

function findGroupOffset(
  data: ListState | undefined,
  code: string | number,
): number | undefined {
  if (!data) return undefined;

  const groupIndex = data.groups.findIndex((g) => g.key === code);
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
    }

    i += 1;
  }

  return data.groups[i].key;
}
