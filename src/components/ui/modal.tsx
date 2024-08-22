import { cx } from "@/utils/cx";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import css from "./modal.module.css";

import { Button } from "./button";

type Props = {
  centerContent?: boolean;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  onClose: () => void;
  open?: boolean;
  size?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Modal(props: Props) {
  const {
    actions,
    centerContent,
    children,
    className,
    onClose,
    open,
    size = "100%",
    ...rest
  } = props;

  const modalRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const hasReset = useRef(false);

  useEffect(() => {
    if (open && !hasReset.current) {
      hasReset.current = true;
      modalRef.current?.scrollTo(0, 0);
    }
  }, [open]);

  const onCloseModalOutside = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === modalRef.current) onClose();
    },
    [onClose],
  );

  const onCloseActions = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === actionRef.current) onClose();
    },
    [onClose],
  );

  const cssVariables = useMemo(
    () => ({
      "--modal-width": size,
    }),
    [size],
  );

  return (
    <div
      {...rest}
      className={cx(css["modal"], centerContent && css["center"], className)}
      onClick={onCloseModalOutside}
      ref={modalRef}
      style={cssVariables as React.CSSProperties}
    >
      <div className={css["inner"]}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: An escape handler is bound higher up. */}
        <div
          className={cx(css["actions"], actions && css["has-custom"])}
          onClick={onCloseActions}
          ref={actionRef}
        >
          <nav className={css["actions-row"]}>{actions}</nav>
          <Button iconOnly onClick={onClose}>
            <XIcon />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

type ModalContentProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  title: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export function ModalContent(props: ModalContentProps) {
  const { children, footer, title, ...rest } = props;

  return (
    <section className={css["content"]} {...rest}>
      <header className={css["content-header"]}>
        <h2 className={css["content-title"]}>{title}</h2>
      </header>
      <div className={css["content-main"]}>{children}</div>
      {footer && <footer className={css["content-footer"]}>{footer}</footer>}
    </section>
  );
}
