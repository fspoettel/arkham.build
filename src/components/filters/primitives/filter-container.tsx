import { Undo2 } from "lucide-react";
import { useCallback } from "react";

import { Button } from "../../ui/button";
import { Collapsible } from "../../ui/collapsible";

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
};

export function FilterContainer(props: Props) {
  const {
    children,
    className,
    nonCollapsibleContent,
    alwaysShowFilterString,
    filterString,
    open,
    onOpenChange,
    onReset,
    title,
    ...rest
  } = props;

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
          <Button
            onClick={onFilterReset}
            iconOnly
            tooltip="Reset filter"
            variant="bare"
          >
            <Undo2 />
          </Button>
        ) : undefined
      }
      className={className}
      nonCollapsibleContent={nonCollapsibleContent}
      onOpenChange={onOpenChange}
      open={open}
      sub={alwaysShowFilterString || !open ? filterString || "All" : undefined}
      title={title}
      variant={filterString && filterString !== "All" ? "active" : undefined}
    >
      {children}
    </Collapsible>
  );
}
