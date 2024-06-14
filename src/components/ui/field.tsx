import { ReactNode } from "react";

import css from "./field.module.css";

type Props = {
  label: ReactNode;
  children: ReactNode;
  id: string;
};

export function Field({ children, label }: Props) {
  return (
    <div className={css["field"]}>
      <label>{label}</label>
      {children}
    </div>
  );
}
