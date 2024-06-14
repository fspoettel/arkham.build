import clsx from "clsx";
import css from "./checkboxgroup.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function CheckboxGroup({ children, className }: Props) {
  return (
    <fieldset className={clsx(css["checkboxgroup"], className)}>
      {children}
    </fieldset>
  );
}
