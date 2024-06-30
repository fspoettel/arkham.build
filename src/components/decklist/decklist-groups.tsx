import clsx from "clsx";
import { useMemo } from "react";

import { useStore } from "@/store";
import type { Grouping } from "@/store/lib/deck-grouping";
import { sortByName, sortBySlots, sortTypesByOrder } from "@/store/lib/sorting";
import { selectForbiddenCardsById } from "@/store/selectors/deck-view";
import { selectCanCheckOwnership } from "@/store/selectors/shared";
import type { Card } from "@/store/services/queries.types";
import type { Slot } from "@/store/slices/deck-edits.types";
import { capitalize } from "@/utils/formatting";
import { useDeckIdChecked } from "@/utils/use-deck-id";

import css from "./decklist-groups.module.css";

import SlotIcon from "../icons/slot-icon";
import { ListCard } from "../list-card/list-card";

type DecklistGroupProps = {
  cards: Card[];
  ignoredCounts?: Record<string, number>;
  listCardSize?: "sm";
  mapping: string;
  ownershipCounts: Record<string, number>;
  quantities?: Record<string, number>;
  renderListCardAfter?: (card: Card, quantity?: number) => React.ReactNode;
};

type DecklistGroupsProps = {
  group: Grouping;
  layout: "one_column" | "two_column";
} & Omit<DecklistGroupProps, "cards">;

export function DecklistGroups({
  group,
  ignoredCounts,
  layout,
  listCardSize,
  mapping,
  ownershipCounts,
  quantities,
  renderListCardAfter,
}: DecklistGroupsProps) {
  const assetGroup = group["asset"] ? (
    <li className={clsx(css["group"], css["asset"])}>
      <h4 className={css["group-title"]}>Asset</h4>
      <ol className={css["group-children"]}>
        {Object.entries(group["asset"] as Record<string, Card[]>)
          .toSorted(([a], [b]) => sortBySlots(a, b))
          .map(([key, val]) => {
            return (
              <li className={css["group-child"]} key={key}>
                <h5 className={css["group-entry_nested-title"]}>
                  <SlotIcon code={key} />
                  {capitalize(key)}
                </h5>
                <DecklistGroup
                  cards={val}
                  ignoredCounts={ignoredCounts}
                  listCardSize={listCardSize}
                  mapping={mapping}
                  ownershipCounts={ownershipCounts}
                  quantities={quantities}
                  renderListCardAfter={renderListCardAfter}
                />
              </li>
            );
          })}
      </ol>
    </li>
  ) : null;

  const rest = Object.keys(group)
    .filter((g) => g !== "asset")
    .toSorted(sortTypesByOrder)
    .map((key) => {
      const k = key as keyof Grouping;
      const entry = group[k] as Card[];
      if (!entry) return null;
      return (
        <li className={clsx(css["group"])} key={k}>
          <h4 className={css["group-title"]}>{capitalize(k)}</h4>
          <DecklistGroup
            cards={entry}
            ignoredCounts={ignoredCounts}
            mapping={mapping}
            ownershipCounts={ownershipCounts}
            quantities={quantities}
            renderListCardAfter={renderListCardAfter}
          />
        </li>
      );
    });

  return layout === "one_column" ? (
    <ol className={css["group_one-col"]}>
      {assetGroup}
      {rest}
    </ol>
  ) : (
    <div className={css["group_two-cols"]}>
      {assetGroup}
      <ol>{rest}</ol>
    </div>
  );
}

function DecklistGroup({
  cards,
  ignoredCounts,
  listCardSize,
  mapping,
  ownershipCounts,
  quantities,
  renderListCardAfter,
}: DecklistGroupProps) {
  const ctx = useDeckIdChecked();

  const forbiddenCards = useStore((state) =>
    selectForbiddenCardsById(state, ctx.deckId, ctx.canEdit),
  );

  const canEdit = ctx.canEdit && mapping !== "bonded";
  const canCheckOwnership = useStore(selectCanCheckOwnership);
  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  const onChangeCardQuantity = useMemo(() => {
    if (!canEdit) return undefined;

    return (code: string, quantity: number) => {
      updateCardQuantity(ctx.deckId, code, quantity, mapping as Slot);
    };
  }, [updateCardQuantity, canEdit, ctx.deckId, mapping]);

  return (
    <ol>
      {cards.toSorted(sortByName).map((card) => (
        <ListCard
          as="li"
          card={card}
          isForbidden={
            forbiddenCards.find(
              (x) => x.code === card.code && x.target === mapping,
            ) != null
          }
          isRemoved={quantities?.[card.code] === 0}
          isIgnored={ignoredCounts?.[card.code]}
          key={card.code}
          omitBorders
          onChangeCardQuantity={onChangeCardQuantity}
          ownedCount={
            canCheckOwnership ? ownershipCounts[card.code] : undefined
          }
          quantity={quantities?.[card.code] ?? 0}
          renderAfter={renderListCardAfter}
          size={listCardSize}
        />
      ))}
    </ol>
  );
}
