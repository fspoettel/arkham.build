import { cx } from "@/utils/cx";
import { useMemo } from "react";

import { useStore } from "@/store";
import type { Grouping } from "@/store/lib/deck-grouping";
import {
  sortByLevel,
  sortByName,
  sortBySlots,
  sortTypesByOrder,
} from "@/store/lib/sorting";
import {
  selectCanCheckOwnership,
  selectCardOwnedCount,
} from "@/store/selectors/shared";
import type { Card } from "@/store/services/queries.types";
import type { Slot } from "@/store/slices/deck-edits.types";
import { capitalize } from "@/utils/formatting";

import css from "./decklist-groups.module.css";

import { getDeckLimitOverride } from "@/store/lib/resolve-deck";
import { selectForbiddenCards } from "@/store/selectors/decks";
import { useResolvedDeckChecked } from "@/utils/use-resolved-deck";
import SlotIcon from "../icons/slot-icon";
import { ListCard } from "../list-card/list-card";

type DecklistGroupProps = {
  cards: Card[];
  disablePlayerCardEdits?: boolean;
  ignoredCounts?: Record<string, number>;
  listCardSize?: "sm";
  mapping: string;
  quantities?: Record<string, number>;
  renderListCardAfter?: (card: Card, quantity?: number) => React.ReactNode;
};

type DecklistGroupsProps = {
  group: Grouping;
  layout: "one_column" | "two_column";
} & Omit<DecklistGroupProps, "cards">;

export function DecklistGroups({
  disablePlayerCardEdits,
  group,
  ignoredCounts,
  layout,
  listCardSize,
  mapping,
  quantities,
  renderListCardAfter,
}: DecklistGroupsProps) {
  const assetGroup = group["asset"] ? (
    <li className={cx(css["group"], css["asset"])}>
      <h4 className={css["group-title"]}>Asset</h4>
      <ol className={css["group-children"]}>
        {Object.entries(group["asset"] as Record<string, Card[]>)
          .sort(([a], [b]) => sortBySlots(a, b))
          .map(([key, val]) => {
            return (
              <li className={css["group-child"]} key={key}>
                <h5 className={css["group-entry_nested-title"]}>
                  <SlotIcon code={key} />
                  {capitalize(key)}
                </h5>
                <DecklistGroup
                  cards={val}
                  disablePlayerCardEdits={disablePlayerCardEdits}
                  ignoredCounts={ignoredCounts}
                  listCardSize={listCardSize}
                  mapping={mapping}
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
    .sort(sortTypesByOrder)
    .map((key) => {
      const k = key as keyof Grouping;
      const entry = group[k] as Card[];
      if (!entry) return null;
      return (
        <li className={cx(css["group"])} key={k}>
          <h4 className={css["group-title"]}>{capitalize(k)}</h4>
          <DecklistGroup
            cards={entry}
            disablePlayerCardEdits={disablePlayerCardEdits}
            ignoredCounts={ignoredCounts}
            mapping={mapping}
            quantities={quantities}
            listCardSize={listCardSize}
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

function DecklistGroup(props: DecklistGroupProps) {
  const {
    cards,
    disablePlayerCardEdits,
    ignoredCounts,
    listCardSize,
    mapping,
    quantities,
    renderListCardAfter,
  } = props;

  const ctx = useResolvedDeckChecked();

  const forbiddenCards = useStore((state) =>
    selectForbiddenCards(state, ctx.resolvedDeck),
  );

  const cardOwnedCount = useStore(selectCardOwnedCount);
  const canEdit = ctx.canEdit && mapping !== "bonded";
  const canCheckOwnership = useStore(selectCanCheckOwnership);
  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  const onChangeCardQuantity = useMemo(() => {
    if (!canEdit) return undefined;

    return (card: Card, quantity: number, limit: number) => {
      updateCardQuantity(
        ctx.resolvedDeck.id,
        card.code,
        quantity,
        limit,
        mapping as Slot,
      );
    };
  }, [updateCardQuantity, canEdit, ctx.resolvedDeck.id, mapping]);

  return (
    <ol>
      {[...cards]
        .sort((a, b) => sortByName(a, b) || sortByLevel(a, b))
        .map((card) => (
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
            limitOverride={getDeckLimitOverride(ctx.resolvedDeck, card.code)}
            key={card.code}
            omitBorders
            onChangeCardQuantity={
              !disablePlayerCardEdits ||
              card.encounter_code ||
              card.subtype_code
                ? onChangeCardQuantity
                : undefined
            }
            ownedCount={canCheckOwnership ? cardOwnedCount(card) : undefined}
            quantity={quantities?.[card.code] ?? 0}
            renderAfter={renderListCardAfter}
            size={listCardSize}
          />
        ))}
    </ol>
  );
}
