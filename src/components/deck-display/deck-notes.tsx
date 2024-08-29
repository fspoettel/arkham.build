import { BookOpenText } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { DialogContentInert, DialogTrigger } from "@/components/ui/dialog";
import { useDialogContext } from "@/components/ui/dialog.hooks";
import { Modal } from "@/components/ui/modal";

import type { ResolvedDeck } from "@/store/lib/types";
import css from "./deck-display.module.css";

type Props = {
  deck: ResolvedDeck;
};

const LazyDeckDescription = lazy(() => import("@/components/deck-description"));

export function DeckNotes(props: Props) {
  const { deck } = props;
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
            <Suspense fallback={null}>
              <LazyDeckDescription
                content={deck.description_md}
                title={deck.name}
              />
            </Suspense>
          )}
        </Modal>
      </DialogContentInert>
    </>
  );
}
