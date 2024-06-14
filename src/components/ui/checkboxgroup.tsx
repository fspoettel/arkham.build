import clsx from "clsx";

import css from "./checkboxgroup.module.css";

type Props = {
  as?: "fieldset" | "div";
  children: React.ReactNode;
  className?: string;
};

export function CheckboxGroup({ as = "fieldset", children, className }: Props) {
  const Tag = as;
  return (
    <Tag className={clsx(css["checkboxgroup"], className)}>{children}</Tag>
  );
}
