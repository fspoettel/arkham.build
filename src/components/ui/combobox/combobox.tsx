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

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: false,
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
      if (onSelectItem) onSelectItem(item.code, !selectedItems[item.code]);

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
      if (onSelectItem) onSelectItem(item.code, false);
    },
    [onSelectItem],
  );

  useEffect(() => {
    listRef.current = [];
    setActiveIndex(filteredItems.length > 0 ? 0 : null);
  }, [filteredItems.length]);

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
                listRef={listRef}
                getItemProps={getItemProps}
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
