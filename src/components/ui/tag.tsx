import { cx } from "@/utils/cx";
import { forwardRef } from "react";
import css from "./tag.module.css";

type Props<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  size?: "xs";
};

export const Tag = forwardRef(function TagInner<T extends React.ElementType>(
  props: Props<T>,
  ref: React.Ref<T>,
) {
  const { as = "span", children, size, ...rest } = props;
  const Element: React.ElementType = as;

  return (
    <Element {...rest} className={cx(css["tag"], size && css[size])} ref={ref}>
      {children}
    </Element>
  );
});
