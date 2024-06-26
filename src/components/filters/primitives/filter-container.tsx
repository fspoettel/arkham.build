import { Undo2 } from "lucide-react";
import { useCallback } from "react";

import type { CollapsibleProps } from "@radix-ui/react-collapsible";
import { Button } from "../../ui/button";
import { Collapsible, CollapsibleContent } from "../../ui/collapsible";

type Props = {
  children: React.ReactNode;
  className?: string;
  nonCollapsibleContent?: React.ReactNode;
  alwaysShowFilterString?: boolean;
  filterString?: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onReset?: () => void;
  title: string;
} & Omit<CollapsibleProps, "title">;

export function FilterContainer({
  alwaysShowFilterString,
  children,
  className,
  filterString,
  nonCollapsibleContent,
  onOpenChange,
  onReset,
  open,
  title,
  ...rest
}: Props) {
  const onFilterReset = useCallback(
    (evt: React.MouseEvent) => {
      evt.preventDefault();
      if (onReset) onReset();
    },
    [onReset],
  );

  return (
    <Collapsible
      {...rest}
      actions={
        filterString && onReset ? (
          <Button onClick={onFilterReset} size="sm" variant="bare">
            <Undo2 />
          </Button>
        ) : undefined
      }
      className={className}
      onOpenChange={onOpenChange}
      open={open}
      sub={alwaysShowFilterString || !open ? filterString || "All" : undefined}
      title={title}
      variant={filterString && filterString !== "All" ? "active" : undefined}
    >
      {nonCollapsibleContent}
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
