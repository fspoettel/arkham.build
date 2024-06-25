import { Minus, Plus } from "lucide-react";

import css from "./quantity-input.module.css";

import { Button } from "./button";

type Props = {
  disabled?: boolean;
  tabIndex?: number;
  onValueChange?: (value: number) => void;
  value: number;
  limit: number;
};

export function QuantityInput({
  disabled,
  limit,
  onValueChange,
  tabIndex,
  value,
}: Props) {
  const decrementCardQuantity = () => {
    if (value <= 0) return;
    onValueChange?.(-1);
  };

  const incrementCardQuantity = () => {
    if (value >= limit) return;
    onValueChange?.(1);
  };

  return (
    <div className={css["container"]}>
      <Button
        disabled={disabled || value <= 0}
        iconOnly
        onClick={decrementCardQuantity}
        size="sm"
        tabIndex={tabIndex}
        variant="bare"
      >
        <Minus />
      </Button>
      <strong className={css["value"]}>{value}</strong>
      <Button
        disabled={disabled || value >= limit}
        iconOnly
        onClick={incrementCardQuantity}
        size="sm"
        tabIndex={tabIndex}
        variant="bare"
      >
        <Plus />
      </Button>
    </div>
  );
}
