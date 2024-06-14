import { XIcon } from "lucide-react";
import { useCallback } from "react";

import css from "./combobox.module.css";

import { Button } from "../button";
import { Tag } from "../tag";

type Props<T extends { code: string }> = {
  onRemove(item: T): void;
  items: T[];
  renderResult: (item: T) => React.ReactNode;
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
    <ul className={css["results"]}>
      {items.map((item) => (
        <Tag key={item.code} size="xs">
          {renderResult(item)}
          <Button onClick={() => onRemoveItem(item)} size="xs" variant="bare">
            <XIcon />
          </Button>
        </Tag>
      ))}
    </ul>
  );
}
