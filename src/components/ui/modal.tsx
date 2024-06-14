import clsx from "clsx";
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
};

export function Modal({
  actions,
  centerContent,
  children,
  className,
  onClose,
  open,
  size = "100%",
}: Props) {
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
      className={clsx(css["modal"], centerContent && css["center"], className)}
      onClick={onCloseModalOutside}
      ref={modalRef}
      style={cssVariables as React.CSSProperties}
    >
      <div className={css["inner"]}>
        <div
          className={clsx(css["actions"], actions && css["has-custom"])}
          onClick={onCloseActions}
          ref={actionRef}
        >
          <nav className={css["actions-row"]}>{actions}</nav>
          <Button onClick={onClose} tabIndex={1} variant="bare">
            <XIcon />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
