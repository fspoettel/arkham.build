import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import css from "./field.module.css";

type Props = {
  bordered?: boolean;
  children: ReactNode;
  className?: string;
  full?: boolean;
  helpText?: string;
  padded?: boolean;
};

export function FieldLabel({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & ComponentProps<"label">) {
  return (
    <label className={clsx(css["field-label"], className)} {...rest}>
      {children}
    </label>
  );
}

export function Field({
  bordered,
  children,
  className,
  full,
  helpText,
  padded,
}: Props) {
  return (
    <div
      className={clsx(
        css["field"],
        className,
        bordered && css["bordered"],
        padded && css["padded"],
        full && css["full"],
      )}
    >
      {children}
      {helpText && <div className={css["field-help"]}>{helpText}</div>}
    </div>
  );
}
