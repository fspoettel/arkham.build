import clsx from "clsx";
import {
  Root,
  Item,
  ToggleGroupSingleProps,
  ToggleGroupMultipleProps,
  ToggleGroupItemProps,
} from "@radix-ui/react-toggle-group";

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
        css["toggle-group"],
        className,
        full && css["is-full"],
        icons && css["is-icons"],
      )}
    />
  );
}

export function ToggleGroupItem(props: ToggleGroupItemProps) {
  return (
    <Item
      {...props}
      className={clsx(css["toggle-group-item"], props.className)}
    />
  );
}
