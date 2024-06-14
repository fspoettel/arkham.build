import {
  CollapsibleContentProps,
  CollapsibleProps,
  Content,
  Root,
  Trigger,
} from "@radix-ui/react-collapsible";
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ReactNode, useState } from "react";

import css from "./collapsible.module.css";

import { Button } from "./button";

type Props = CollapsibleProps & {
  children: ReactNode;
  className?: string;
  onOpenChange?: (x: boolean) => void;
  title: ReactNode;
};

export function Collapsible({
  className,
  children,
  defaultOpen = false,
  onOpenChange,
  title,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Root
      className={clsx(css["collapsible-root"], className)}
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        onOpenChange?.(val);
      }}
    >
      <div className={css["collapsible-header"]}>
        <h4 onClick={() => setOpen(true)}>{title}</h4>
        <Trigger asChild>
          <Button variant="icon">
            {open ? <Cross2Icon /> : <RowSpacingIcon />}
          </Button>
        </Trigger>
      </div>
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
