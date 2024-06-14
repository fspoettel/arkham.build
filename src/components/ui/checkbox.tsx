import type { CheckboxProps } from "@radix-ui/react-checkbox";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

import css from "./checkbox.module.css";

type Props = CheckboxProps & {
  className?: string;
  hideLabel?: boolean;
  id: string;
  label: ReactNode;
};

export function Checkbox({ className, id, hideLabel, label, ...rest }: Props) {
  return (
    <div className={clsx(css["checkbox"], className)}>
      <Root {...rest} className={css["checkbox-root"]} id={id}>
        <Indicator className={css["checkbox-indicator"]}>
          <Check />
        </Indicator>
      </Root>
      <label
        className={clsx(css["checkbox-label"], hideLabel && "sr-only")}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}
