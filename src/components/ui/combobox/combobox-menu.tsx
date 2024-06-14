import { CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { MutableRefObject, ReactNode } from "react";

import type { Coded } from "@/store/services/types";

import css from "./combobox.module.css";

import { Scroller } from "../scroll-area";

export function ComboboxMenu<T extends Coded>({
  activeIndex,
  getItemProps,
  items,
  listRef,
  renderItem,
  selectedItems,
  setSelectedItem,
}: {
  activeIndex: number | null;
  items: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemProps: any;
  listRef: MutableRefObject<HTMLElement[]>;
  renderItem: (t: T) => ReactNode;
  selectedItems: Record<string, T>;
  setSelectedItem: (t: T) => void;
}) {
  return (
    <Scroller
      viewportClassName={css["combobox-menu-viewport"]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ "--viewport-item-count": items.length } as any}
    >
      {items.map((item, index) => {
        const active = activeIndex === index;
        return (
          <div
            key={item.code}
            tabIndex={active ? 0 : -1}
            ref={(node) => {
              if (node instanceof HTMLElement) {
                listRef.current[index] = node;
              }
            }}
            {...getItemProps({
              className: clsx(
                css["combobox-menu-item"],
                active && css["active"],
              ),
              id: item.code,
              onClick() {
                setSelectedItem(item);
              },
            })}
          >
            {!!selectedItems[item.code] && (
              <CheckIcon className={css["combobox-menu-item-check"]} />
            )}
            {renderItem(item)}
          </div>
        );
      })}
    </Scroller>
  );
}
