import { cx } from "@/utils/cx";
import type {
  RadioGroupItemProps,
  RadioGroupProps,
} from "@radix-ui/react-radio-group";
import { Item, Root } from "@radix-ui/react-radio-group";

import css from "./radio-button-group.module.css";

type Props = RadioGroupProps & {
  full?: boolean;
  icons?: boolean;
};

export function RadioButtonGroup(props: Props) {
  const { full, icons, className, ...rest } = props;

  return (
    <Root
      {...rest}
      className={cx(
        css["radio-button-group"],
        className,
        full && css["is-full"],
        icons && css["is-icons"],
      )}
    />
  );
}

type GroupItemProps = RadioGroupItemProps & {
  size?: "small" | "default";
};

export function RadioButtonGroupItem({
  className,
  size,
  ...rest
}: GroupItemProps) {
  return (
    <Item {...rest} className={cx(css["item"], size && css[size], className)} />
  );
}
