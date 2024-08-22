import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { Id } from "@/store/slices/data.types";
import { Shuffle } from "lucide-react";

type Props = {
  deckId: Id;
  quantity?: number;
};

export function DrawBasicWeakness(props: Props) {
  const drawRandomBasicWeakness = useStore(
    (state) => state.drawRandomBasicWeakness,
  );

  return (
    <Button
      disabled={!props.quantity}
      onClick={() => drawRandomBasicWeakness(props.deckId)}
      size="sm"
      data-testid="draw-basic-weakness"
      variant="bare"
      tooltip="Draw a random basic weakness"
    >
      <Shuffle />
    </Button>
  );
}
