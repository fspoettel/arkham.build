import clsx from "clsx";
import type { ReactNode } from "react";

import css from "./field.module.css";

type Props = {
  bordered?: boolean;
  children: ReactNode;
  className?: string;
  full?: boolean;
  helpText?: string;
};

export function Field({
  bordered,
  children,
  className,
  full,
  helpText,
}: Props) {
  return (
    <div
      className={clsx(
        css["field"],
        className,
        bordered && css["bordered"],
        full && css["full"],
      )}
    >
      {children}
      {helpText && <p className={css["field-help"]}>{helpText}</p>}
    </div>
  );
}
