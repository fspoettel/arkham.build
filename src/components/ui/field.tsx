import clsx from "clsx";
import type { ReactNode } from "react";

import css from "./field.module.css";

type Props = {
  children: ReactNode;
  className?: string;
  helpText?: string;
};

export function Field({ children, className, helpText }: Props) {
  return (
    <div className={clsx(css["field"], className)}>
      {children}
      {helpText && <p className={css["field-help"]}>{helpText}</p>}
    </div>
  );
}
