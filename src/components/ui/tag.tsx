import { cx } from "@/utils/cx";

import css from "./tag.module.css";

type Props = {
  as?: React.JSX.ElementType;
  children: React.ReactNode;
  size?: "xs";
};

export function Tag(props: Props) {
  const { as = "span", children, size } = props;
  const Element = as;

  return (
    <Element className={cx(css["tag"], size && css[size])}>{children}</Element>
  );
}
