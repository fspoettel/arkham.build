import type {
  CollapsibleContentProps,
  CollapsibleProps,
} from "@radix-ui/react-collapsible";
import { Content, Root, Trigger } from "@radix-ui/react-collapsible";
import clsx from "clsx";
import { UnfoldVertical, XIcon } from "lucide-react";

import css from "./collapsible.module.css";

import { Button } from "./button";

type Props = Omit<CollapsibleProps, "title"> & {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (x: boolean) => void;
  sub?: React.ReactNode;
  title: React.ReactNode;
  header?: React.ReactNode;
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
      className={clsx(css["collapsible"], className)}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Trigger asChild>
        <div className={css["header"]}>
          {header || (
            <div>
              <h4>{title}</h4>
              <div className={css["sub"]}>{sub}</div>
            </div>
          )}
          <div className={css["actions"]}>
            {actions}
            <Button variant="bare">
              {open ? <XIcon /> : <UnfoldVertical />}
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
  children: React.ReactNode;
};

export function CollapsibleContent({ className, children }: ContentProps) {
  return (
    <Content>
      <div className={clsx(css["content"], className)}>{children}</div>
    </Content>
  );
}
