import type {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { Item, Root } from "@radix-ui/react-toggle-group";
import clsx from "clsx";

import css from "./toggle-group.module.css";

type ToggleGroupProps = (ToggleGroupSingleProps | ToggleGroupMultipleProps) & {
  full?: boolean;
  icons?: boolean;
};

export function ToggleGroup({
  full,
  icons,
  className,
  ...rest
}: ToggleGroupProps) {
  return (
    <Root
      {...rest}
      className={clsx(
        css["togglegroup"],
        className,
        full && css["is-full"],
        icons && css["is-icons"],
      )}
    />
  );
}

type GroupItemProps = ToggleGroupItemProps & {
  size?: "small" | "default" | "small-type";
};

export function ToggleGroupItem({ className, size, ...rest }: GroupItemProps) {
  return (
    <Item
      {...rest}
      className={clsx(css["item"], size && css[size], className)}
    />
  );
}
