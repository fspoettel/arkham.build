import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { Id } from "@/store/slices/data.types";
import { Shuffle } from "lucide-react";

type Props = {
  deckId: Id;
  quantity?: number;
};

export function DrawBasicWeakness({ deckId, quantity }: Props) {
  const drawRandomBasicWeakness = useStore(
    (state) => state.drawRandomBasicWeakness,
  );

  return (
    <Button
      disabled={!quantity}
      onClick={() => drawRandomBasicWeakness(deckId)}
      size="sm"
      variant="bare"
    >
      <Shuffle />
    </Button>
  );
}
