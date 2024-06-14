import { useCallback } from "react";

import { ListCard } from "@/components/card-list/list-card";
import { DeckInvestigator } from "@/components/deck-investigator/deck-investigator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  useDialogContext,
} from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import type { DisplayDeck } from "@/store/lib/deck-grouping";

type Props = {
  deck: DisplayDeck;
};

export function DeckEditInvestigator(props: Props) {
  return (
    <Dialog>
      <DeckEditInvestigatorInner {...props} />
    </Dialog>
  );
}

export function DeckEditInvestigatorInner({ deck }: Props) {
  const modalContext = useDialogContext();

  const onCloseModal = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  const isParallelBack = !!deck.investigatorBack.card.parallel;

  return (
    <>
      <DialogTrigger>
        <ListCard
          canOpenModal={false}
          card={deck.investigatorFront.card}
          showInvestigatorIcons
          tooltip={
            <DeckInvestigator
              canToggleBack={false}
              deck={deck}
              forceShowHeader={isParallelBack}
              size="tooltip"
            />
          }
        />
      </DialogTrigger>
      <DialogContent>
        <Modal
          actions={
            <Button
              as="a"
              href={`/card/${deck.investigatorFront.card.code}`}
              tabIndex={2}
              target="_blank"
            >
              Open card page
            </Button>
          }
          onClose={onCloseModal}
        >
          <DeckInvestigator
            canToggleBack={false}
            deck={deck}
            forceShowHeader={isParallelBack}
            size="full"
          />
        </Modal>
      </DialogContent>
    </>
  );
}
