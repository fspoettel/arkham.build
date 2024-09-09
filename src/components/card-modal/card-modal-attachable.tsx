import type { ResolvedDeck } from "@/store/lib/types";
import type { AttachableDefinition } from "@/utils/constants";
import { AttachmentIcon } from "../attachments/attachments";

import { useStore } from "@/store";
import { makeSortFunction } from "@/store/lib/sorting";
import type { Card } from "@/store/services/queries.types";
import { getCardColor } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { useCallback, useMemo } from "react";
import { attachmentDefinitionLimit, canAttach } from "../attachments/utils";
import { useAttachmentsChangeHandler } from "../attachments/utils";
import { ListCard } from "../list-card/list-card";
import css from "./card-modal.module.css";

type Props = {
  card: Card;
  definition: AttachableDefinition;
  resolvedDeck: ResolvedDeck;
};

type Entry = {
  card: Card;
  attached: number;
  quantity: number;
};

export function CardModalAttachable(props: Props) {
  const { card, definition, resolvedDeck } = props;

  const sortFunction = useStore((state) =>
    makeSortFunction(["type", "name"], state.metadata),
  );

  const onAttachmentQuantityChange = useAttachmentsChangeHandler();

  const onQuantityChange = useCallback(
    (card: Card, quantity: number) => {
      onAttachmentQuantityChange?.(definition, card, quantity);
    },
    [onAttachmentQuantityChange, definition],
  );

  const targetAttachments = resolvedDeck.attachments?.[definition.code] ?? {};

  const total = Object.values({
    ...definition.requiredCards,
    ...targetAttachments,
  }).reduce((sum, count) => sum + count, 0);

  const cards = useMemo(
    () =>
      Object.values(resolvedDeck.cards.slots)
        .reduce<Entry[]>((acc, curr) => {
          if (canAttach(curr.card, definition)) {
            acc.push({
              card: curr.card,
              attached:
                definition.requiredCards?.[curr.card.code] ??
                targetAttachments[curr.card.code] ??
                0,
              quantity: resolvedDeck.slots[curr.card.code] ?? 0,
            });
          }

          return acc;
        }, [])
        .sort((a, b) => sortFunction(a.card, b.card)),
    [
      resolvedDeck.cards.slots,
      resolvedDeck.slots,
      targetAttachments,
      definition,
      sortFunction,
    ],
  );

  const colorCls = getCardColor(card, "background");

  return (
    <article className={css["attachable-container"]}>
      <header className={cx(css["attachable-header"], colorCls)}>
        <h3 className={css["attachable-title"]}>
          <AttachmentIcon name={definition.icon} />
          {definition.name}
        </h3>
        <div className={css["attachable-stats"]}>
          {total} / {definition.targetSize}
        </div>
      </header>
      <ul className={css["attachable-content"]}>
        {cards.map((entry) => (
          <ListCard
            as="li"
            key={entry.card.code}
            card={entry.card}
            quantity={entry.attached}
            limitOverride={attachmentDefinitionLimit(
              entry.card,
              entry.quantity,
              definition.limit,
            )}
            onChangeCardQuantity={onQuantityChange}
          />
        ))}
      </ul>
    </article>
  );
}
