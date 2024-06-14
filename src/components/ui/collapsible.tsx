import type {
  CollapsibleContentProps,
  CollapsibleProps,
} from "@radix-ui/react-collapsible";
import { Content, Root, Trigger } from "@radix-ui/react-collapsible";
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { ReactNode } from "react";

import css from "./collapsible.module.css";

import { Button } from "./button";

type Props = Omit<CollapsibleProps, "title"> & {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  onOpenChange?: (x: boolean) => void;
  sub?: ReactNode;
  title: ReactNode;
  header?: ReactNode;
};

export function Collapsible({
  actions,
  className,
  children,
  open,
  onOpenChange,
  sub,
  title,
  header,
  ...rest
}: Props) {
  return (
    <Root
      {...rest}
      className={clsx(css["collapsible-root"], className)}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Trigger asChild>
        <div className={css["collapsible-header"]}>
          {header || (
            <div className={css["collapsible-titles"]}>
              <h4>{title}</h4>
              <div className={css["collapsible-sub"]}>{sub}</div>
            </div>
          )}
          <div className={css["collapsible-actions"]}>
            {actions}
            <Button variant="bare">
              {open ? <Cross2Icon /> : <RowSpacingIcon />}
            </Button>
          </div>
        </div>
      </Trigger>
      {children}
    </Root>
  );
}

type ContentProps = CollapsibleContentProps & {
  className?: string;
  children: ReactNode;
};

export function CollapsibleContent({ className, children }: ContentProps) {
  return (
    <Content>
      <div className={clsx(css["collapsible-content"], className)}>
        {children}
      </div>
    </Content>
  );
}
