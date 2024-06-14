import clsx from "clsx";
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons";
import {
  Root,
  Trigger,
  Content,
  CollapsibleProps,
  CollapsibleContentProps,
} from "@radix-ui/react-collapsible";
import { ReactNode, useState } from "react";

import css from "./collapsible.module.css";

type Props = CollapsibleProps & {
  children: ReactNode;
  className?: string;
  onOpenChange?: (x: boolean) => void;
  title: ReactNode;
};

export function Collapsible({
  className,
  children,
  onOpenChange,
  title,
}: Props) {
  const [open, setOpen] = useState(false);

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
        <h4>{title}</h4>
        <Trigger asChild>
          <button className="button-icon">
            {open ? <Cross2Icon /> : <RowSpacingIcon />}
          </button>
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
