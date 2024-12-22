import { cx } from "@/utils/cx";
import type { CheckboxProps } from "@radix-ui/react-checkbox";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { useRef } from "react";
import css from "./checkbox.module.css";

type Props = Omit<CheckboxProps, "label"> & {
  className?: string;
  hideLabel?: boolean;
  id?: string;
  label: React.ReactNode;
  actAsButton?: boolean;
};

export function Checkbox(props: Props) {
  const { className, id, hideLabel, label, actAsButton, ...rest } = props;
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    if (checkboxRef.current) {
      checkboxRef.current.click();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents:  handled by children.
    <div
      className={cx(css["checkbox"], className, actAsButton && css["button"])}
      onClick={actAsButton ? handleClick : undefined}
    >
      <Root {...rest} className={css["root"]} id={id} ref={checkboxRef}>
        <Indicator className={css["indicator"]}>
          <CheckIcon />
        </Indicator>
      </Root>
      <label className={cx(css["label"], hideLabel && "sr-only")} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
