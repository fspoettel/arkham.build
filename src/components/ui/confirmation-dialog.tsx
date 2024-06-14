import css from "./confirmation-dialog.module.css";

import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";
import { Modal } from "./modal";

export type Config = {
  confirmLabel: string;
  cancelLabel: string;
  message: string;
};

type Props = {
  config: Config;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({ config, onConfirm, onCancel }: Props) {
  return (
    <Dialog open>
      <DialogContent>
        <Modal onClose={onCancel} size="40rem">
          <div className={css["confirmation"]}>
            {config.message}
            <nav className={css["confirmation-nav"]}>
              <Button onClick={onConfirm} size="lg">
                {config.confirmLabel}
              </Button>
              <Button onClick={onCancel} size="lg" variant="bare">
                {config.cancelLabel}
              </Button>
            </nav>
          </div>
        </Modal>
      </DialogContent>
    </Dialog>
  );
}
