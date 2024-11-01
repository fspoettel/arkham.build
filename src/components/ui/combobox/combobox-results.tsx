import { XIcon } from "lucide-react";
import { Button } from "../button";
import { Tag } from "../tag";
import css from "./combobox.module.css";

type Props<T extends { code: string }> = {
  onRemove?: (item: T) => void;
  items: T[];
  renderResult: (item: T) => React.ReactNode;
};

export function ComboboxResults<T extends { code: string }>(props: Props<T>) {
  const { items, onRemove, renderResult } = props;

  if (!items.length) return null;

  return (
    <ul className={css["results"]}>
      {items.map((item) => (
        <Tag
          key={item.code}
          size="xs"
          data-testid={`combobox-result-${item.code}`}
        >
          {renderResult(item)}
          {onRemove && (
            <Button
              data-testid="combobox-result-remove"
              iconOnly
              onClick={() => {
                onRemove(item);
              }}
              size="xs"
              variant="bare"
            >
              <XIcon />
            </Button>
          )}
        </Tag>
      ))}
    </ul>
  );
}
