import clsx from "clsx";
import { XIcon } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { useCallback, useRef } from "react";

import css from "./modal.module.css";

import { Button } from "./button";

type Props = {
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
};

export function Modal({ actions, onClose, children }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={css["modal"]} onClick={onCloseModalOutside} ref={modalRef}>
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
