import { cx } from "@/utils/cx";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import css from "./quantity-input.module.css";

type Props = {
  disabled?: boolean;
  tabIndex?: number;
  onValueChange?: (value: number, limit: number) => void;
  value: number;
  limit: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function QuantityInput(props: Props) {
  const {
    className,
    disabled,
    limit,
    onValueChange,
    tabIndex,
    value,
    ...rest
  } = props;

  const decrementCardQuantity = () => {
    if (value <= 0) return;
    onValueChange?.(-1, limit);
  };

  const incrementCardQuantity = () => {
    if (value >= limit) return;
    onValueChange?.(1, limit);
  };

  return (
    <div {...rest} className={cx(css["container"], className)}>
      <Button
        data-testid="quantity-decrement"
        disabled={disabled || value <= 0}
        iconOnly
        onClick={decrementCardQuantity}
        size="sm"
        tabIndex={tabIndex}
        variant="bare"
      >
        <MinusIcon />
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
        <PlusIcon />
      </Button>
    </div>
  );
}
