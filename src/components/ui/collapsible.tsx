import { cx } from "@/utils/cx";
import type {
  CollapsibleContentProps,
  CollapsibleProps,
} from "@radix-ui/react-collapsible";
import { Content, Root, Trigger } from "@radix-ui/react-collapsible";
import { UnfoldVertical, XIcon } from "lucide-react";

import css from "./collapsible.module.css";

import { Button } from "./button";

type Props = Omit<CollapsibleProps, "title"> & {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerReversed?: boolean;
  omitBorder?: boolean;
  omitPadding?: boolean;
  onOpenChange?: (x: boolean) => void;
  sub?: React.ReactNode;
  title: React.ReactNode;
  header?: React.ReactNode;
  variant?: "active";
};

export function Collapsible(props: Props) {
  const {
    actions,
    className,
    children,
    disabled,
    open,
    omitBorder,
    omitPadding,
    onOpenChange,
    sub,
    title,
    triggerReversed,
    header,
    variant,
    ...rest
  } = props;

  return (
    <Root
      {...rest}
      className={cx(
        css["collapsible"],
        !omitPadding && css["padded"],
        !omitBorder && css["bordered"],
        variant && css[variant],
        className,
      )}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Trigger asChild>
        <div
          className={cx(css["trigger"], triggerReversed && css["reversed"])}
          data-testid="collapsible-trigger"
        >
          {header || (
            <div className={css["header"]}>
              <h4>{title}</h4>
              <div className={css["sub"]}>{sub}</div>
            </div>
          )}
          <div className={css["actions"]}>
            {actions}
            <Button
              iconOnly
              variant="bare"
              tooltip={
                open == null
                  ? "Toggle section"
                  : open
                    ? "Collapse section"
                    : "Expand section"
              }
            >
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
      <div className={cx(css["content"], className)}>{children}</div>
    </Content>
  );
}
