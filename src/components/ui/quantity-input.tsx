import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

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
          onClick={decrementCardQuantity}
          disabled={disabled || value <= 0}
          variant="bare"
          size="sm"
        >
          <MinusIcon />
        </Button>
        <strong className={css["quantity-input-value"]}>{value}</strong>
        <Button
          onClick={incrementCardQuantity}
          disabled={disabled || value >= limit}
          variant="bare"
          size="sm"
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
