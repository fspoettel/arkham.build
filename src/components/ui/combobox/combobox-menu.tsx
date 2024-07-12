import { cx } from "@/utils/cx";
import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GroupedVirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";

import type { Coded } from "@/store/services/queries.types";

import css from "./combobox.module.css";

import { Scroller } from "../scroller";

type Props<T extends Coded> = {
  activeIndex: number | undefined;
  items: T[];
  listRef: React.MutableRefObject<HTMLElement[]>;
  renderItem: (t: T) => React.ReactNode;
  selectedItems: string[];
  setActiveIndex: (i: number) => void;
  setSelectedItem: (t: T) => void;
};

export function ComboboxMenu<T extends Coded>(props: Props<T>) {
  const {
    activeIndex,
    items,
    listRef,
    renderItem,
    selectedItems,
    setActiveIndex,
    setSelectedItem,
  } = props;

  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  useEffect(() => {
    if (activeIndex != null && virtuosoRef.current) {
      virtuosoRef.current.scrollIntoView({
        index: activeIndex,
        behavior: "auto",
      });
    }
  }, [activeIndex]);

  const cssVariables = useMemo(
    () => ({
      "--viewport-item-count": items.length,
    }),
    [items],
  );

  return (
    <Scroller
      ref={setScrollParent as unknown as React.RefObject<HTMLDivElement>}
      style={cssVariables as React.CSSProperties}
      viewportClassName={css["menu-viewport"]}
    >
      <Virtuoso
        customScrollParent={scrollParent}
        data={items}
        itemContent={(index, item) => {
          const active = activeIndex === index;
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: TODO.
            <div
              className={cx(css["menu-item"], active && css["active"])}
              id={item.code}
              onClick={() => {
                setSelectedItem(item);
              }}
              onPointerOver={() => {
                setActiveIndex(index);
              }}
              ref={(node) => {
                if (node instanceof HTMLElement) {
                  listRef.current[index] = node;
                }
              }}
              tabIndex={active ? 0 : -1}
            >
              {selectedItems.includes(item.code) && (
                <Check className={css["menu-item-check"]} />
              )}
              {renderItem(item)}
            </div>
          );
        }}
        ref={virtuosoRef}
      />
    </Scroller>
  );
}
