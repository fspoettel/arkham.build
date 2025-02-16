import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { ArrowLeftToLineIcon } from "lucide-react";
import { useCallback } from "react";

type Props = {
  card: Card;
  deck: ResolvedDeck;
};

export function MoveToSideDeck(props: Props) {
  const { card, deck } = props;
  const moveToSideDeck = useStore((state) => state.moveToSideDeck);

  const onButtonClick = useCallback(() => {
    moveToSideDeck(card, deck.id);
  }, [card, deck.id, moveToSideDeck]);

  return (
    <Button
      data-testid="editor-move-to-side"
      iconOnly
      onClick={onButtonClick}
      tooltip="Move to side deck"
    >
      <ArrowLeftToLineIcon />
    </Button>
  );
}
