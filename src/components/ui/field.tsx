import { cx } from "@/utils/cx";

import css from "./field.module.css";

type Props = {
  bordered?: boolean;
  children: React.ReactNode;
  className?: string;
  full?: boolean;
  helpText?: React.ReactNode;
  padded?: boolean;
};

export function FieldLabel({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<"label">) {
  return (
    <label className={cx(css["label"], className)} {...rest}>
      {children}
    </label>
  );
}

export function Field(props: Props) {
  const { bordered, children, className, full, helpText, padded } = props;

  return (
    <div
      className={cx(
        css["field"],
        className,
        bordered && css["bordered"],
        padded && css["padded"],
        full && css["full"],
      )}
    >
      {children}
      {helpText && <div className={css["help"]}>{helpText}</div>}
    </div>
  );
}
