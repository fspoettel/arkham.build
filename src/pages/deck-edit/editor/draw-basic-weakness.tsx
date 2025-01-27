import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { Id } from "@/store/slices/data.types";
import { ShuffleIcon } from "lucide-react";

type Props = {
  deckId: Id;
  quantity?: number;
  targetDeck: string;
};

export function DrawBasicWeakness(props: Props) {
  const drawRandomBasicWeakness = useStore(
    (state) => state.drawRandomBasicWeakness,
  );

  return (
    <Button
      disabled={!props.quantity || props.targetDeck !== "slots"}
      iconOnly
      onClick={() => drawRandomBasicWeakness(props.deckId)}
      size="sm"
      data-testid="draw-basic-weakness"
      variant="bare"
      tooltip="Draw a random basic weakness"
    >
      <ShuffleIcon />
    </Button>
  );
}
