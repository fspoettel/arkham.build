import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { Id } from "@/store/slices/data.types";
import { ShuffleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  deckId: Id;
  quantity?: number;
  targetDeck: string;
};

export function DrawBasicWeakness(props: Props) {
  const { t } = useTranslation();

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
      tooltip={t("deck_edit.actions.draw_random_basic_weakness")}
      variant="bare"
    >
      <ShuffleIcon />
    </Button>
  );
}
