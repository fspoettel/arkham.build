import { cx } from "@/utils/cx";
import { forwardRef } from "react";

import css from "./button.module.css";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type Props<T extends "a" | "button" | "summary" | "label"> =
  React.ComponentProps<T> & {
    as?: T;
    children: React.ReactNode;
    className?: string;
    iconOnly?: boolean;
    variant?: "primary" | "secondary" | "bare";
    size?: "xs" | "sm" | "lg" | "full" | "none";
    tooltip?: React.ReactNode;
  };

export const Button = forwardRef(function Button<
  T extends "a" | "button" | "summary" | "label",
>(props: Props<T>, ref: React.ForwardedRef<T>) {
  const {
    as,
    children,
    iconOnly,
    variant = "secondary",
    size,
    tooltip,
    ...rest
  } = props;
  // biome-ignore lint/suspicious/noExplicitAny: safe.
  const Element: any = as ?? "button";

  const button = (
    <Element
      {...rest}
      className={cx(
        css["button"],
        variant && css[variant],
        size && css[size],
        iconOnly && css["icon-only"],
        rest.className,
      )}
      ref={ref}
    >
      {children}
    </Element>
  );

  if (!tooltip) return button;

  return (
    <Tooltip delay={300}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
});
