import type { CheckboxProps } from "@radix-ui/react-checkbox";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { Check } from "lucide-react";

import css from "./checkbox.module.css";

type Props = Omit<CheckboxProps, "label"> & {
  className?: string;
  hideLabel?: boolean;
  id: string;
  label: React.ReactNode;
};

export function Checkbox({ className, id, hideLabel, label, ...rest }: Props) {
  return (
    <div className={clsx(css["checkbox"], className)}>
      <Root {...rest} className={css["root"]} id={id}>
        <Indicator className={css["indicator"]}>
          <Check />
        </Indicator>
      </Root>
      <label
        className={clsx(css["label"], hideLabel && "sr-only")}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}
