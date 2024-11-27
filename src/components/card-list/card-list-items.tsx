import { useStore } from "@/store";
import type { getDeckLimitOverride } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectResolvedCardById } from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import type { ViewMode } from "@/store/slices/lists.types";
import { Card as CardComponent } from "../card/card";
import { ListCard } from "../list-card/list-card";
import { CardActions } from "./card-actions";
import css from "./card-list-items.module.css";
import type { CardListItemProps } from "./types";

type Props = CardListItemProps & {
  card: Card;
  currentTop: number;
  index: number;
  size?: "xs" | "sm" | "investigator";
  limitOverride?: ReturnType<typeof getDeckLimitOverride>;
  ownedCount?: number;
  quantity?: number;
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
    renderCardExtra,
    renderCardAction,
    renderCardAfter,
    renderCardMetaExtra,
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
      renderCardAfter={renderCardAfter}
      renderCardAction={renderCardAction}
      renderCardExtra={renderCardExtra}
      renderCardMetaExtra={renderCardMetaExtra}
      showCardText={viewMode === "card-text"}
      size={size}
    />
  );
}

export function CardListItemFull(props: Props) {
  const {
    card,
    onChangeCardQuantity,
    limitOverride,
    quantity,
    renderCardAction,
    renderCardExtra,
    resolvedDeck,
  } = props;

  const resolvedCard = useStore((state) =>
    selectResolvedCardById(state, card.code, resolvedDeck),
  );

  if (!resolvedCard) return null;

  return (
    <div className={css["card-list-item-full"]}>
      <CardComponent
        headerActions={
          <CardActions
            card={card}
            onChangeCardQuantity={onChangeCardQuantity}
            limitOverride={limitOverride}
            quantity={quantity}
            renderCardAction={renderCardAction}
            renderCardExtra={renderCardExtra}
          />
        }
        resolvedCard={resolvedCard}
        size="full"
        titleLinks="card-modal"
      />
    </div>
  );
}
