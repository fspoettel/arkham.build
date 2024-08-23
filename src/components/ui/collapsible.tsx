import { cx } from "@/utils/cx";
import { UnfoldVertical, XIcon } from "lucide-react";

import css from "./collapsible.module.css";

import { useControllableState } from "@/utils/use-controllable-state";
import { useCallback } from "react";
import { Button } from "./button";

type Props = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  header?: React.ReactNode;
  nonCollapsibleContent?: React.ReactNode;
  omitBorder?: boolean;
  omitPadding?: boolean;
  onOpenChange?: (x: boolean) => void;
  open?: boolean;
  sub?: React.ReactNode;
  title: React.ReactNode;
  triggerReversed?: boolean;
  variant?: "active";
};

export function Collapsible(props: Props) {
  const {
    actions,
    className,
    children,
    defaultOpen,
    disabled,
    nonCollapsibleContent,
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

  const [isOpen, onChange] = useControllableState({
    defaultState: defaultOpen,
    state: open,
    onChange: onOpenChange,
  });

  const onToggleOpen = useCallback(() => {
    onChange((p) => !p);
  }, [onChange]);

  return (
    <div
      {...rest}
      className={cx(
        css["collapsible"],
        !omitPadding && css["padded"],
        !omitBorder && css["bordered"],
        variant && css[variant],
        isOpen && css["open"],
        className,
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: handled by contained button.*/}
      <div
        className={cx(css["trigger"], triggerReversed && css["reversed"])}
        data-testid="collapsible-trigger"
        onClick={onToggleOpen}
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
              isOpen == null
                ? "Toggle section"
                : isOpen
                  ? "Collapse section"
                  : "Expand section"
            }
          >
            {isOpen ? <XIcon /> : <UnfoldVertical />}
          </Button>
        </div>
      </div>
      {nonCollapsibleContent}
      <div className={css["content"]} data-state={isOpen ? "open" : "closed"}>
        {isOpen && children}
      </div>
    </div>
  );
}
