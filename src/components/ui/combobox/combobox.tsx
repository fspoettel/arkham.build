import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react";
import { CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Coded } from "@/store/services/types";

import css from "./combobox.module.css";

import { ComboboxResults } from "./combobox-results";

function defaultItemToString<T extends Coded>(val: T) {
  return val.code.toLowerCase();
}

function defaultRenderer<T extends Coded>(val: T) {
  return val.code;
}

type Props<T extends Coded> = {
  className?: string;
  id: string;
  items: T[];
  itemToString?: (item: T) => string;
  label: ReactNode;
  onSelectItem: (code: string, val: boolean) => void;
  placeholder?: string;
  renderItem?: (item: T) => ReactNode;
  renderResult?: (item: T) => ReactNode;
  selectedItems: Record<string, T>;
};

export function Combobox<T extends Coded>({
  className,
  id,
  items,
  itemToString = defaultItemToString,
  label,
  placeholder,
  onSelectItem,
  renderItem = defaultRenderer,
  renderResult = defaultRenderer,
  selectedItems,
}: Props<T>) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { context, refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
    open: isOpen,
    middleware: [
      flip(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
      offset(5),
    ],
    onOpenChange: setOpen,
  });

  const listRef = useRef<HTMLElement[]>([]);

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
  });

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [dismiss, listNavigation],
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        itemToString(item).startsWith(inputValue.toLowerCase()),
      ),
    [items, inputValue, itemToString],
  );

  const setSelectedItem = useCallback(
    (item: T) => {
      onSelectItem(item.code, !selectedItems[item.code]);

      const ref = refs.reference.current as HTMLInputElement;

      setInputValue("");
      if (ref && document.activeElement !== ref) {
        ref.focus();
      }
    },
    [refs.reference, onSelectItem, selectedItems],
  );

  const removeSelectedItem = useCallback(
    (item: T) => {
      onSelectItem(item.code, false);
    },
    [onSelectItem],
  );

  useEffect(() => {
    if (activeIndex == null && filteredItems.length === 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredItems]);

  return (
    <div className={clsx(css["combobox"], className)}>
      <div className={css["combobox-control"]}>
        <label className={clsx(css["combobox-label"], "sr-only")} htmlFor={id}>
          {label}
        </label>
        <div className={css["combobox-control-row"]}>
          <input
            ref={refs.setReference}
            {...getReferenceProps({
              id,
              className: css["combobox-input"],
              type: "text",
              value: inputValue,
              placeholder: placeholder,
              autoFocus: true,
              onKeyDown(evt) {
                if (evt.key === "Enter" && activeIndex != null) {
                  evt.preventDefault();
                  const activeItem = filteredItems[activeIndex];

                  if (activeItem) {
                    setSelectedItem(activeItem);
                    setOpen(false);
                  }
                } else if (!isOpen) {
                  setOpen(true);
                }
              },
              onClick() {
                setOpen(!isOpen);
              },
              onChange(evt) {
                setInputValue((evt.target as HTMLInputElement).value);
              },
            })}
          />
        </div>
      </div>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} initialFocus={-1}>
            <ol
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps({
                className: css["combobox-menu"],
                ref: refs.setFloating,
              })}
            >
              {filteredItems.map((item, index) => {
                const active = activeIndex === index;

                return (
                  <li
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
                  </li>
                );
              })}
            </ol>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
      <ComboboxResults
        items={Object.values(selectedItems)}
        onRemove={removeSelectedItem}
        renderResult={renderResult}
      />
    </div>
  );
}
