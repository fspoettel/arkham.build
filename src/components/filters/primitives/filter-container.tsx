import { ResetIcon } from "@radix-ui/react-icons";
import type { MouseEvent } from "react";
import { type ReactNode, useCallback } from "react";

import { Button } from "../../ui/button";
import { Collapsible, CollapsibleContent } from "../../ui/collapsible";

type Props = {
  children: ReactNode;
  nonCollapsibleContent?: ReactNode;
  alwaysShowFilterString?: boolean;
  filterString?: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onReset?: () => void;
  title: string;
};

export function FilterContainer({
  alwaysShowFilterString,
  children,
  filterString,
  nonCollapsibleContent,
  onOpenChange,
  onReset,
  open,
  title,
}: Props) {
  const onFilterReset = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      if (onReset) onReset();
    },
    [onReset],
  );

  return (
    <Collapsible
      actions={
        filterString && onReset ? (
          <Button size="sm" variant="bare" onClick={onFilterReset}>
            <ResetIcon />
          </Button>
        ) : undefined
      }
      open={open}
      onOpenChange={onOpenChange}
      sub={alwaysShowFilterString || !open ? filterString || "All" : undefined}
      title={title}
    >
      {nonCollapsibleContent}
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
