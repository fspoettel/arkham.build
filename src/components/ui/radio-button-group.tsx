import {
  Item,
  RadioGroupItemProps,
  RadioGroupProps,
  Root,
} from "@radix-ui/react-radio-group";
import clsx from "clsx";

import css from "./radio-button-group.module.css";

type Props = RadioGroupProps & {
  full?: boolean;
  icons?: boolean;
};

export function RadioButtonGroup({ full, icons, className, ...rest }: Props) {
  return (
    <Root
      {...rest}
      className={clsx(
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
    <Item
      {...rest}
      className={clsx(
        css["radio-button-group-item"],
        size && css[size],
        className,
      )}
    />
  );
}
