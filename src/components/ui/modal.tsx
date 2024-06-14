import clsx from "clsx";
import { XIcon } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import css from "./modal.module.css";

import { Button } from "./button";

type Props = {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  onClose: () => void;
  open?: boolean;
  size?: string;
};

export function Modal({
  actions,
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
    (evt: MouseEvent<HTMLDivElement>) => {
      if (evt.target === modalRef.current) onClose();
    },
    [onClose],
  );

  const onCloseActions = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
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
      className={clsx(css["modal"], className)}
      onClick={onCloseModalOutside}
      ref={modalRef}
      style={cssVariables as React.CSSProperties}
    >
      <div className={css["modal-inner"]}>
        <div
          className={clsx(css["modal-actions"], actions && css["has-actions"])}
          onClick={onCloseActions}
          ref={actionRef}
        >
          {actions}
          <Button onClick={onClose} tabIndex={1} variant="bare">
            <XIcon />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
