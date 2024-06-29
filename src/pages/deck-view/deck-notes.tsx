import { BookOpenText } from "lucide-react";
import { useCallback } from "react";

import { DeckDescription } from "@/components/deck-description";
import { Button } from "@/components/ui/button";
import { DialogContentInert, DialogTrigger } from "@/components/ui/dialog";
import { useDialogContext } from "@/components/ui/dialog.hooks";
import { Modal } from "@/components/ui/modal";
import type { DisplayDeck } from "@/store/lib/deck-grouping";

import css from "./deck-view.module.css";

type Props = {
  deck: DisplayDeck;
};

export function DeckNotes({ deck }: Props) {
  const modalContext = useDialogContext();

  const onCloseNotes = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  return (
    <>
      <DialogTrigger asChild>
        <div className={css["floating"]}>
          <Button
            className={css["floating-element"]}
            data-testid="view-notes-toggle"
            size="lg"
          >
            <BookOpenText />
            Show notes
          </Button>
        </div>
      </DialogTrigger>
      <DialogContentInert>
        <Modal
          onClose={onCloseNotes}
          open={modalContext.open}
          size="36rem"
          data-testid="view-notes-modal"
        >
          {modalContext.open && (
            <DeckDescription content={deck.description_md} title={deck.name} />
          )}
        </Modal>
      </DialogContentInert>
    </>
  );
}
