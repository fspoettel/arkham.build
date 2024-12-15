import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { DeckInvestigator } from "@/components/deck-investigator/deck-investigator";
import { DeckInvestigatorModal } from "@/components/deck-investigator/deck-investigator-modal";
import { ListCard } from "@/components/list-card/list-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDialogContextChecked } from "@/components/ui/dialog.hooks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ResolvedDeck } from "@/store/lib/types";
import { ChartAreaIcon, MessageCircleHeartIcon, Rows3Icon } from "lucide-react";
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

  const openView = (() => {
    switch (location) {
      case "/":
        return "card-list";
      case "/tools":
        return "deck-tools";
      case "/recommendations":
        return "recommendations";
    }
  })();

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
      <ToggleGroup
        defaultValue="card-list"
        data-testid="toggle-investigator-card-view"
        icons
        type="single"
        value={openView}
      >
        <Link to="/" asChild>
          <ToggleGroupItem
            data-testid="investigator-card-view-card-list"
            value="card-list"
            tooltip="View card list"
          >
            <Rows3Icon />
          </ToggleGroupItem>
        </Link>
        <Link to="/tools" asChild>
          <ToggleGroupItem
            data-testid="investigator-card-view-deck-tools"
            value="deck-tools"
            tooltip="View deck tools"
          >
            <ChartAreaIcon />
          </ToggleGroupItem>
        </Link>
        <Link to="/recommendations" asChild>
          <ToggleGroupItem
            data-testid="investigator-card-view-recommendations"
            value="recommendations"
            tooltip="View card recommendations"
          >
            <MessageCircleHeartIcon />
          </ToggleGroupItem>
        </Link>
      </ToggleGroup>
    </div>
  );
}
