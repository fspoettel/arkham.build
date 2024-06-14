import { ResetIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

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
  return (
    <Collapsible
      actions={
        filterString && onReset ? (
          <Button size="sm" variant="bare" onClick={onReset}>
            <ResetIcon style={{ fontSize: "0.875rem" }} />
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
