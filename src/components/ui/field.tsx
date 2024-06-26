import clsx from "clsx";

import css from "./field.module.css";

type Props = {
  bordered?: boolean;
  children: React.ReactNode;
  className?: string;
  full?: boolean;
  helpText?: string;
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
    <label className={clsx(css["label"], className)} {...rest}>
      {children}
    </label>
  );
}

export function Field({
  bordered,
  children,
  className,
  full,
  helpText,
  padded,
}: Props) {
  return (
    <div
      className={clsx(
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
