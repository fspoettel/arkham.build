import clsx from "clsx";
import { ComponentProps, ForwardedRef, ReactNode, forwardRef } from "react";

import css from "./button.module.css";

type Props<T extends "a" | "button" | "summary"> = ComponentProps<T> & {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: "bare";
  size?: "sm" | "full";
};

export const Button = forwardRef(function Button<
  T extends "a" | "button" | "summary",
>({ as, children, variant, size, ...rest }: Props<T>, ref: ForwardedRef<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Element: any = as ?? "button";

  return (
    <Element
      {...rest}
      className={clsx(
        css["button"],
        variant && css[variant],
        size && css[size],
        rest.className,
      )}
      ref={ref}
    >
      {children}
    </Element>
  );
});
