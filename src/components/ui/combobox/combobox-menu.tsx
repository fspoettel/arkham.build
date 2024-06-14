import clsx from "clsx";
import { Check } from "lucide-react";
import {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GroupedVirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";

import type { Coded } from "@/store/services/types";

import css from "./combobox.module.css";

import { Scroller } from "../scroller";

type Props<T extends Coded> = {
  activeIndex: number | null;
  items: T[];
  listRef: MutableRefObject<HTMLElement[]>;
  renderItem: (t: T) => ReactNode;
  selectedItems: string[];
  setActiveIndex: (i: number) => void;
  setSelectedItem: (t: T) => void;
};

export function ComboboxMenu<T extends Coded>({
  activeIndex,
  items,
  listRef,
  renderItem,
  selectedItems,
  setActiveIndex,
  setSelectedItem,
}: Props<T>) {
  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  useEffect(() => {
    if (activeIndex !== null && virtuosoRef.current) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={setScrollParent as any}
      style={cssVariables as React.CSSProperties}
      viewportClassName={css["combobox-menu-viewport"]}
    >
      <Virtuoso
        customScrollParent={scrollParent}
        data={items}
        itemContent={(index, item) => {
          const active = activeIndex === index;
          return (
            <div
              className={clsx(
                css["combobox-menu-item"],
                active && css["active"],
              )}
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
                <Check className={css["combobox-menu-item-check"]} />
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
