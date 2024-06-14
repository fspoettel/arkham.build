import clsx from "clsx";
import { UnfoldVertical } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import css from "./expander.module.css";

import { Button } from "./button";

type Props = {
  children: React.ReactNode;
  collapsedHeight?: string;
  defaultExpanded?: boolean;
  label?: React.ReactNode;
};

export function Expander({
  children,
  collapsedHeight = "15.625rem",
  defaultExpanded,
  label,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const contentRef = useRef<HTMLDivElement>(null);

  const cssVariables = useMemo(
    () => ({
      "--collapsed-height": collapsedHeight,
    }),
    [collapsedHeight],
  );

  return (
    <article
      className={clsx(css["expander"], isExpanded && css["expanded"])}
      style={cssVariables as React.CSSProperties}
    >
      {label && (
        <header className={css["header"]}>
          <h2 className={css["label"]}>{label}</h2>
        </header>
      )}
      <div className={css["content"]} ref={contentRef}>
        {children}
      </div>
      <Button
        className={css["toggle"]}
        onClick={() => {
          setIsExpanded((prev) => !prev);
        }}
        variant="bare"
      >
        <UnfoldVertical />
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
    </article>
  );
}
