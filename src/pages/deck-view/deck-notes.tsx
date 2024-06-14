import { BookOpenText } from "lucide-react";
import { useCallback } from "react";

import { DeckDescription } from "@/components/deck-description";
import { Button } from "@/components/ui/button";
import {
  DialogContentInert,
  DialogTrigger,
  useDialogContext,
} from "@/components/ui/dialog";
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
        <div className={css["page-floating"]}>
          <Button
            className={css["page-floating-button"]}
            size="lg"
            variant="secondary"
          >
            <BookOpenText />
            Show notes
          </Button>
        </div>
      </DialogTrigger>
      <DialogContentInert>
        <Modal onClose={onCloseNotes} open={modalContext.open} size="36rem">
          {modalContext.open && (
            <DeckDescription content={deck.description_md} title={deck.name} />
          )}
        </Modal>
      </DialogContentInert>
    </>
  );
}