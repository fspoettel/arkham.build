import clsx from "clsx";
import { ComponentProps, ForwardedRef, ReactNode, forwardRef } from "react";

import css from "./button.module.css";

type Props<T extends "a" | "button"> = ComponentProps<T> & {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: "icon" | "bare";
};

export const Button = forwardRef(function Button<T extends "a" | "button">(
  { as, children, variant, ...rest }: Props<T>,
  ref: ForwardedRef<T>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Element: any = as ?? "button";

  return (
    <Element
      {...rest}
      className={clsx(css["button"], variant && css[variant], rest.className)}
      ref={ref}
    >
      {children}
    </Element>
  );
});
