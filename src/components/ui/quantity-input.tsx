import { Minus, Plus } from "lucide-react";

import css from "./quantity-input.module.css";

import { Button } from "./button";

type Props = {
  disabled?: boolean;
  tabIndex?: number;
  onValueChange?: (value: number) => void;
  value: number;
  limit: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function QuantityInput(props: Props) {
  const { disabled, limit, onValueChange, tabIndex, value, ...rest } = props;

  const decrementCardQuantity = () => {
    if (value <= 0) return;
    onValueChange?.(-1);
  };

  const incrementCardQuantity = () => {
    if (value >= limit) return;
    onValueChange?.(1);
  };

  return (
    <div className={css["container"]} {...rest}>
      <Button
        data-testid="quantity-decrement"
        disabled={disabled || value <= 0}
        iconOnly
        onClick={decrementCardQuantity}
        size="sm"
        tabIndex={tabIndex}
        variant="bare"
      >
        <Minus />
      </Button>
      <strong className={css["value"]} data-testid="quantity-value">
        {value}
      </strong>
      <Button
        data-testid="quantity-increment"
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
