import type { CheckboxProps } from "@radix-ui/react-checkbox";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { ReactNode } from "react";

import css from "./checkbox.module.css";

type Props = CheckboxProps & {
  className?: string;
  id: string;
  label: ReactNode;
};

export function Checkbox({ className, id, label, ...rest }: Props) {
  return (
    <div className={clsx(css["checkbox"], className)}>
      <Root {...rest} className={css["checkbox-root"]} id={id}>
        <Indicator className={css["checkbox-indicator"]}>
          <CheckIcon />
        </Indicator>
      </Root>
      <label className={css["checkbox-label"]} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
