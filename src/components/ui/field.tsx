import { ReactNode } from "react";

import css from "./field.module.css";

type Props = {
  children: ReactNode;
  helpText?: string;
};

export function Field({ children, helpText }: Props) {
  return (
    <div className={css["field"]}>
      {children}
      {helpText && <p className={css["field-help"]}>{helpText}</p>}
    </div>
  );
}
