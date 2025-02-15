import type { CollapsibleProps } from "@radix-ui/react-collapsible";
import { Undo2Icon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

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
            tooltip={t("filters.reset_filter")}
            variant="bare"
          >
            <Undo2Icon />
          </Button>
        ) : undefined
      }
      className={className}
      onOpenChange={onOpenChange}
      open={open}
      sub={
        alwaysShowFilterString || !open
          ? filterString || t("filters.all")
          : undefined
      }
      title={title}
      variant={
        filterString && filterString !== t("filters.all") ? "active" : undefined
      }
    >
      {nonCollapsibleContent}
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
