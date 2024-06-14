import { Minus, Plus } from "lucide-react";

import css from "./quantity-input.module.css";

import { Button } from "./button";

type Props = {
  disabled?: boolean;
  onValueChange: (value: number) => void;
  value: number;
  limit: number;
};

export function QuantityInput({
  disabled,
  limit,
  onValueChange,
  value,
}: Props) {
  const decrementCardQuantity = () => {
    if (value <= 0) return;
    onValueChange(-1);
  };

  const incrementCardQuantity = () => {
    if (value >= limit) return;
    onValueChange(1);
  };

  return (
    <div className={css["quantity-input-row"]}>
      <div className={css["quantity-input"]}>
        <Button
          disabled={disabled || value <= 0}
          onClick={decrementCardQuantity}
          size="sm"
          variant="bare"
        >
          <Minus />
        </Button>
        <strong className={css["quantity-input-value"]}>{value}</strong>
        <Button
          disabled={disabled || value >= limit}
          onClick={incrementCardQuantity}
          size="sm"
          variant="bare"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
