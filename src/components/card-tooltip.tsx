import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import css from "./card-tooltip.module.css";
import { Card } from "./card/card";

type Props = {
  code: string;
};

export function CardTooltip(props: Props) {
  const ctx = useResolvedDeck();

  const resolvedCard = useStore((state) =>
    selectCardWithRelations(state, props.code, false, ctx.resolvedDeck),
  );

  if (!resolvedCard) return null;

  return (
    <div className={css["tooltip"]}>
      <Card resolvedCard={resolvedCard} size="tooltip" />
    </div>
  );
}
