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

export function MoveToMainDeck(props: Props) {
  const { card, deck } = props;
  const moveToMainDeck = useStore((state) => state.moveToMainDeck);

  const onButtonClick = useCallback(() => {
    moveToMainDeck(card, deck.id);
  }, [card, deck.id, moveToMainDeck]);

  return (
    <Button
      data-testid="editor-move-to-main"
      iconOnly
      onClick={onButtonClick}
      size="sm"
      tooltip="Move to deck"
    >
      <ArrowLeftToLineIcon />
    </Button>
  );
}
