import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { useDeckId } from "@/utils/use-deck-id";

import css from "./card-tooltip.module.css";

import { Card } from "./card/card";

type Props = {
  code: string;
};

export function CardTooltip({ code }: Props) {
  const deckIdCtx = useDeckId();

  const resolvedCard = useStore((state) =>
    selectCardWithRelations(
      state,
      code,
      false,
      deckIdCtx?.deckId,
      deckIdCtx?.canEdit,
    ),
  );

  if (!resolvedCard) return null;

  return (
    <div className={css["tooltip"]}>
      <Card resolvedCard={resolvedCard} size="tooltip" />
    </div>
  );
}
