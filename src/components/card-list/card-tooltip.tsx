import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";

import css from "./card-tooltip.module.css";

import { ResolvedCard } from "../card/resolved-card";

type Props = {
  code: string;
};

export function CardTooltip({ code }: Props) {
  const resolvedCard = useStore((state) =>
    selectCardWithRelations(state, code, true),
  );

  if (!resolvedCard) return null;

  return (
    <div className={css["tooltip"]}>
      <ResolvedCard resolvedCard={resolvedCard} size="tooltip" />
    </div>
  );
}
