import { cx } from "@/utils/cx";
import type { CheckboxProps } from "@radix-ui/react-checkbox";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import css from "./checkbox.module.css";

type Props = Omit<CheckboxProps, "label"> & {
  className?: string;
  hideLabel?: boolean;
  id?: string;
  label: React.ReactNode;
};

export function Checkbox(props: Props) {
  const { className, id, hideLabel, label, ...rest } = props;
  const checkboxRef = useRef<HTMLButtonElement>(null);

  const preventDefault = useCallback((evt: React.MouseEvent) => {
    evt.preventDefault();
  }, []);

  return (
    <div className={cx(css["checkbox"], className)}>
      <Root {...rest} className={css["root"]} id={id} ref={checkboxRef}>
        <Indicator className={css["indicator"]}>
          <CheckIcon />
        </Indicator>
      </Root>
      <label
        className={cx(css["label"], hideLabel && "sr-only")}
        onPointerDown={preventDefault}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}
