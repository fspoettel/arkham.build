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
} from "@floating-ui/react";
import uFuzzy from "@leeoniya/ufuzzy";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Coded } from "@/store/services/types";

import css from "./combobox.module.css";

import { ComboboxMenu } from "./combobox-menu";
import { ComboboxResults } from "./combobox-results";

function defaultItemToString<T extends Coded>(val: T) {
  return val.code.toLowerCase();
}

function defaultRenderer<T extends Coded>(val: T) {
  return val.code;
}

function fuzzyMatch<T extends Coded>(
  search: string,
  items: T[],
  itemToString: (item: T) => string,
) {
  if (!search) return items;

  const uf = new uFuzzy();
  const searchItems = items.map(itemToString);

  const results = uf.search(searchItems, search, 1);
  if (!results?.[0]) return items;

  const matches = results[0].reduce<Record<string, boolean>>((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});

  return items.filter((_, i) => matches[i]);
}

type Props<T extends Coded> = {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  id: string;
  items: T[];
  itemToString?: (item: T) => string;
  label: ReactNode;
  onSelectItem?: (code: string, val: boolean) => void;
  placeholder?: string;
  renderItem?: (item: T) => ReactNode;
  renderResult?: (item: T) => ReactNode;
  showLabel?: boolean;
  selectedItems: Record<string, T>;
};

// TODO: the logic here is very messy, extract to a reducer when adding group support.
export function Combobox<T extends Coded>({
  autoFocus,
  className,
  disabled,
  id,
  items,
  itemToString = defaultItemToString,
  label,
  placeholder,
  onSelectItem,
  renderItem = defaultRenderer,
  renderResult = defaultRenderer,
  selectedItems,
  showLabel,
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
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
      offset(5),
    ],
    onOpenChange: setOpen,
  });

  const listRef = useRef<HTMLElement[]>([]);

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const filteredItems = useMemo(
    () => fuzzyMatch(inputValue, items, itemToString),
    [items, inputValue, itemToString],
  );

  const setSelectedItem = useCallback(
    (item: T) => {
      if (onSelectItem) onSelectItem(item.code, !selectedItems[item.code]);

      const ref = refs.reference.current;

      if (ref instanceof HTMLInputElement) {
        setInputValue("");
        if (ref && document.activeElement !== ref) {
          ref.focus();
        }
      }
    },
    [refs.reference, onSelectItem, selectedItems],
  );

  const removeSelectedItem = useCallback(
    (item: T) => {
      if (onSelectItem) onSelectItem(item.code, false);
    },
    [onSelectItem],
  );

  useEffect(() => {
    listRef.current = [];
    setActiveIndex(filteredItems.length > 0 ? 0 : null);
  }, [filteredItems.length]);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [isOpen]);

  return (
    <div className={clsx(css["combobox"], className)}>
      <div className={css["combobox-control"]}>
        <label
          className={clsx(css["combobox-label"], !showLabel && "sr-only")}
          htmlFor={id}
        >
          {label}
        </label>
        <div className={css["combobox-control-row"]}>
          <input
            ref={refs.setReference}
            {...getReferenceProps({
              id,
              className: css["combobox-input"],
              disabled,
              type: "text",
              value: inputValue,
              placeholder: placeholder,
              autoFocus,
              onKeyDown(evt) {
                if (evt.key === "Enter" && activeIndex != null) {
                  evt.preventDefault();
                  const activeItem = filteredItems[activeIndex];
                  if (activeItem) {
                    setSelectedItem(activeItem);
                    setOpen(false);
                  }
                } else if (evt.key === "ArrowDown") {
                  evt.preventDefault();
                  setActiveIndex((prev) => {
                    if (activeIndex == null || prev == null) return 0;
                    return prev < filteredItems.length - 1 ? prev + 1 : prev;
                  });
                  if (!isOpen) setOpen(true);
                } else if (evt.key === "ArrowUp") {
                  evt.preventDefault();
                  setActiveIndex((prev) => {
                    if (prev === null) return 0;
                    return prev > 0 ? prev - 1 : prev;
                  });
                  if (!isOpen) setOpen(true);
                } else if (
                  !isOpen &&
                  !evt.metaKey &&
                  !evt.altKey &&
                  evt.key !== "Backspace" &&
                  evt.key !== "Shift"
                ) {
                  setOpen(true);
                }
              },
              onClick() {
                setOpen(!isOpen);
              },
              onChange(evt) {
                if (evt.target instanceof HTMLInputElement) {
                  setInputValue(evt.target.value);
                }
              },
            })}
          />
        </div>
      </div>
      {isOpen && (
        <FloatingPortal id="floating">
          <FloatingFocusManager context={context} initialFocus={-1}>
            <div
              className={css["combobox-menu"]}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps({
                ref: refs.setFloating,
              })}
            >
              <ComboboxMenu
                activeIndex={activeIndex}
                items={filteredItems}
                setSelectedItem={setSelectedItem}
                setActiveIndex={setActiveIndex}
                listRef={listRef}
                selectedItems={selectedItems}
                renderItem={renderItem}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
      {!!Object.values(selectedItems).length && (
        <ComboboxResults
          items={Object.values(selectedItems)}
          onRemove={removeSelectedItem}
          renderResult={renderResult}
        />
      )}
    </div>
  );
}
