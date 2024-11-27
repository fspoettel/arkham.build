import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { DeckInvestigator } from "@/components/deck-investigator/deck-investigator";
import { DeckInvestigatorModal } from "@/components/deck-investigator/deck-investigator-modal";
import { ListCard } from "@/components/list-card/list-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDialogContextChecked } from "@/components/ui/dialog.hooks";
import type { ResolvedDeck } from "@/store/lib/types";
import { ChartAreaIcon, Rows3Icon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import css from "./investigator-listcard.module.css";

type Props = {
  deck: ResolvedDeck;
};

export function InvestigatorListcard(props: Props) {
  return (
    <Dialog>
      <InvestigatorListcardInner {...props} />
    </Dialog>
  );
}

function InvestigatorListcardInner({ deck }: Props) {
  const [location] = useLocation();

  const cardModalContext = useCardModalContext();
  const modalContext = useDialogContextChecked();

  useEffect(() => {
    if (cardModalContext.isOpen) {
      modalContext?.setOpen(false);
    }
  }, [cardModalContext.isOpen, modalContext.setOpen]);

  const onCloseModal = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  const card = {
    ...deck.investigatorFront.card,
    parallel:
      deck.investigatorFront.card.parallel ||
      deck.investigatorBack.card.parallel,
  };

  const deckToolsOpen = location.endsWith("/tools");

  return (
    <div
      className={css["investigator-container"]}
      data-testid="investigator-container"
    >
      <DialogTrigger className={css["trigger-container"]}>
        <ListCard
          card={card}
          disableModalOpen
          omitBorders
          showInvestigatorIcons
          size="investigator"
          tooltip={
            <DeckInvestigator
              canToggleBack={false}
              deck={deck}
              readonly
              size="tooltip"
            />
          }
        />
      </DialogTrigger>
      <DialogContent>
        <DeckInvestigatorModal deck={deck} onCloseModal={onCloseModal} />
      </DialogContent>
      <Link to={deckToolsOpen ? "/" : "/tools"} asChild>
        <Button
          as="a"
          tooltip={deckToolsOpen ? "View card list" : "View deck tools"}
          iconOnly
        >
          {deckToolsOpen ? <Rows3Icon /> : <ChartAreaIcon />}
        </Button>
      </Link>
    </div>
  );
}
