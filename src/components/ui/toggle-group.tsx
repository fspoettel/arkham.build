import type {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { Item, Root } from "@radix-ui/react-toggle-group";
import clsx from "clsx";

import css from "./toggle-group.module.css";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

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

type GroupItemProps = Omit<ToggleGroupItemProps, "size"> & {
  size?: "small" | "default" | "small-type";
  tooltip?: string;
};

export function ToggleGroupItem({
  className,
  size,
  tooltip,
  ...rest
}: GroupItemProps) {
  const element = (
    <Item
      {...rest}
      className={clsx(css["item"], size && css[size], className)}
    />
  );

  if (!tooltip) return element;

  return (
    <Tooltip delay={300}>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
