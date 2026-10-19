import { useStore } from "@/store";
import { makeSortFunction } from "@/store/lib/sorting";
import type { ResolvedDeck } from "@/store/lib/types";
import {
  selectLocaleSortingCollator,
  selectMetadata,
} from "@/store/selectors/shared";
import { ListCard } from "../list-card/list-card";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  DefaultModalContent,
  Modal,
  ModalActions,
  ModalInner,
} from "../ui/modal";
import { type ChartSelection, getChartCards } from "./chart-cards";

type Props = {
  deck: ResolvedDeck;
  selection: ChartSelection | null;
  onClose: () => void;
};

export function ChartCardsModal({ deck, selection, onClose }: Props) {
  const metadata = useStore(selectMetadata);
  const collator = useStore(selectLocaleSortingCollator);

  const cards = selection
    ? getChartCards(deck, selection).sort(
        makeSortFunction(["name", "level", "position"], metadata, collator),
      )
    : [];

  return (
    <Dialog
      open={selection !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent aria-label={selection?.title}>
        <Modal data-testid="chart-cards-modal">
          <ModalInner size="45rem">
            <ModalActions />
            <DefaultModalContent title={selection?.title}>
              <ol>
                {cards.map((card) => (
                  <ListCard
                    annotation={deck.annotations[card.code]}
                    as="li"
                    card={card}
                    key={card.code}
                    quantity={deck.slots[card.code]}
                  />
                ))}
              </ol>
            </DefaultModalContent>
          </ModalInner>
        </Modal>
      </DialogContent>
    </Dialog>
  );
}
