import type { CollapsibleProps } from "@radix-ui/react-collapsible";
import { CircleIcon, Undo2Icon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Collapsible, CollapsibleContent } from "../../ui/collapsible";
import css from "./filter-container.module.css";

type Props = {
  alwaysShowChanges?: boolean;
  changes?: string;
  children: React.ReactNode;
  className?: string;
  nonCollapsibleContent?: React.ReactNode;
  onOpenChange: (val: boolean) => void;
  onReset?: () => void;
  open: boolean;
  title: string;
} & Omit<CollapsibleProps, "title">;

export function FilterContainer(props: Props) {
  const {
    changes,
    children,
    className,
    nonCollapsibleContent,
    alwaysShowChanges,
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

  const active = !!changes;

  return (
    <Collapsible
      {...rest}
      actions={
        changes && onReset ? (
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
      sub={alwaysShowChanges || !open ? changes || t("filters.all") : undefined}
      title={
        <span className={css["title-container"]}>
          {active && <CircleIcon className={css["active"]} />}
          {title}
        </span>
      }
      variant={active ? "active" : undefined}
    >
      {nonCollapsibleContent}
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
