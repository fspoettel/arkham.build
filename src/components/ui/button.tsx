import clsx from "clsx";
import { forwardRef } from "react";

import css from "./button.module.css";

type Props<T extends "a" | "button" | "summary" | "label"> =
  React.ComponentProps<T> & {
    as?: T;
    children: React.ReactNode;
    className?: string;
    iconOnly?: boolean;
    variant?: "primary" | "secondary" | "bare";
    size?: "xs" | "sm" | "lg" | "full" | "none";
  };

export const Button = forwardRef(function Button<
  T extends "a" | "button" | "summary" | "label",
>(
  { as, children, iconOnly, variant = "secondary", size, ...rest }: Props<T>,
  ref: React.ForwardedRef<T>,
) {
  // biome-ignore lint/suspicious/noExplicitAny: safe.
  const Element: any = as ?? "button";

  return (
    <Element
      {...rest}
      className={clsx(
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
});
