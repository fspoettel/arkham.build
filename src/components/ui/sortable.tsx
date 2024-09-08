import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";

import { useCallback } from "react";
import css from "./sortable.module.css";

type Props<T> = {
  className?: string;
  items: T[];
  onSort(items: T[]): void;
  renderItem: (item: T) => React.ReactNode;
};

export function Sortable<T>(props: Props<T>) {
  const { items, onSort, renderItem } = props;

  const onHandleMove = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      const delta = Number(evt.currentTarget.dataset.delta);
      const idx = Number(evt.currentTarget.dataset.index);
      const nextIdx = idx + delta;

      const sorted = [...items];
      [sorted[idx], sorted[nextIdx]] = [sorted[nextIdx], sorted[idx]];

      onSort(sorted);
    },
    [onSort, items],
  );

  return (
    <ul className={css["items"]}>
      {items.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no natural key available.
        <li className={css["item"]} key={i}>
          <div className={css["item-content"]}>{renderItem(item)}</div>
          <div className={css["item-actions"]}>
            <Button
              data-delta={-1}
              data-index={i}
              onClick={onHandleMove}
              disabled={i === 0}
              iconOnly
              size="xs"
            >
              <ChevronUp />
            </Button>
            <Button
              data-delta={1}
              data-index={i}
              onClick={onHandleMove}
              disabled={i === items.length - 1}
              iconOnly
              size="xs"
            >
              <ChevronDown />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
