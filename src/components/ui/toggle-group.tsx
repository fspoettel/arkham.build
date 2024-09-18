import { cx } from "@/utils/cx";
import type {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { Item, Root } from "@radix-ui/react-toggle-group";

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
      className={cx(
        css["togglegroup"],
        className,
        full && css["is-full"],
        icons && css["is-icons"],
      )}
    />
  );
}

type GroupItemProps = Omit<ToggleGroupItemProps, "size"> & {
  tooltip?: string;
};

export function ToggleGroupItem({
  className,
  tooltip,
  ...rest
}: GroupItemProps) {
  const element = <Item {...rest} className={cx(css["item"], className)} />;

  if (!tooltip) return element;

  return (
    <Tooltip delay={300}>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
