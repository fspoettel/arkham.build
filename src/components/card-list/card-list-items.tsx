import { useStore } from "@/store";
import type { getDeckLimitOverride } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectResolvedCardById } from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import type { ViewMode } from "@/store/slices/lists.types";
import { Card as CardComponent } from "../card/card";
import { ListCard } from "../list-card/list-card";
import type { Props as ListCardProps } from "../list-card/list-card";

import { sideways } from "@/utils/card-utils";
import { CardScan } from "../card/card-scan";
import css from "./card-list.module.css";

type Props = {
  card: Card;
  currentTop: number;
  index: number;
  size?: "xs" | "sm" | "investigator";
  limitOverride?: ReturnType<typeof getDeckLimitOverride>;
  onChangeCardQuantity?: (card: Card, quantity: number, limit: number) => void;
  ownedCount?: number;
  quantity?: number;
  renderAction?: ListCardProps["renderAction"];
  renderAfter?: ListCardProps["renderAfter"];
  renderExtra?: ListCardProps["renderExtra"];
  renderMetaExtra?: ListCardProps["renderMetaExtra"];
  resolvedDeck?: ResolvedDeck;
  viewMode: ViewMode;
};

export function CardListItemCompact(props: Props) {
  const {
    card,
    currentTop,
    index,
    size,
    limitOverride,
    onChangeCardQuantity,
    ownedCount,
    quantity,
    viewMode,
    renderAfter,
    renderAction,
    renderMetaExtra,
    renderExtra,
  } = props;

  return (
    <ListCard
      card={card}
      disableKeyboard
      isActive={index === currentTop}
      key={card.code}
      limitOverride={limitOverride}
      onChangeCardQuantity={onChangeCardQuantity}
      ownedCount={ownedCount}
      quantity={quantity}
      renderAction={renderAction}
      renderAfter={renderAfter}
      renderExtra={renderExtra}
      renderMetaExtra={renderMetaExtra}
      showCardText={viewMode === "card-text"}
      size={size}
    />
  );
}

export function CardListItemFull(props: Props) {
  const { card, resolvedDeck } = props;

  const resolvedCard = useStore((state) =>
    selectResolvedCardById(state, card.code, resolvedDeck),
  );

  if (!resolvedCard) return null;
  return (
    <div className={css["card-list-item-full"]}>
      <CardComponent resolvedCard={resolvedCard} size="full" />
    </div>
  );
}

export function CardListItemScan(props: Props) {
  const { card } = props;

  return <CardScan code={card.code} sideways={sideways(card)} />;
}
