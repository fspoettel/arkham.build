import clsx from "clsx";
import { Info } from "lucide-react";

import css from "./notice.module.css";

type Variant = "info";

type Props = {
  as?: React.ElementType;
  children: React.ReactNode;
  variant?: "info";
};

function getIconForVariant(variant?: Variant) {
  switch (variant) {
    case "info":
      return <Info />;

    default:
      return null;
  }
}

export function Notice({ as = "div", children, variant }: Props) {
  const Element = as;

  const icon = getIconForVariant(variant);

  return (
    <Element className={clsx(css["notice"], variant && css[variant])}>
      {!!icon && <div className={css["notice-icon"]}>{icon}</div>}
      <div className={css["notice-content"]}>{children}</div>
    </Element>
  );
}
