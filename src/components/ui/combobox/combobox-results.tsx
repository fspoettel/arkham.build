import { Cross1Icon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import { useCallback } from "react";

import css from "./combobox.module.css";

type Props<T extends { code: string }> = {
  onRemove(item: T): void;
  items: T[];
  renderResult: (item: T) => ReactNode;
};

export function ComboboxResults<T extends { code: string }>({
  items,
  onRemove,
  renderResult,
}: Props<T>) {
  const onRemoveItem = useCallback(
    (item: T) => {
      onRemove(item);
    },
    [onRemove],
  );

  if (!items.length) return null;

  return (
    <ul className={css["combobox-results"]}>
      {items.map((item) => (
        <li className={css["combobox-result"]} key={item.code}>
          <button onClick={() => onRemoveItem(item)}>
            {renderResult(item)} <Cross1Icon />
          </button>
        </li>
      ))}
    </ul>
  );
}
