import { useStore } from "@/store";
import {
  type DeckGrouping,
  isGroupCollapsed,
  resolveParents,
  resolveQuantities,
} from "@/store/lib/deck-grouping";
import { getDeckLimitOverride } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectForbiddenCards } from "@/store/selectors/decks";
import {
  selectCanCheckOwnership,
  selectCardOwnedCount,
} from "@/store/selectors/shared";
import type { Card } from "@/store/services/queries.types";
import { useCallback } from "react";
import { GroupLabel } from "../card-list/grouphead";
import type { FilteredListCardPropsGetter } from "../card-list/types";
import { ListCard } from "../list-card/list-card";
import css from "./decklist-groups.module.css";

type DecklistGroupsProps = {
  deck: ResolvedDeck;
  grouping: DeckGrouping;
  getListCardProps?: FilteredListCardPropsGetter;
};

export function DecklistGroup(props: DecklistGroupsProps) {
  const { deck, grouping, getListCardProps } = props;

  const metadata = useStore((state) => state.metadata);
  const canCheckOwnership = useStore(selectCanCheckOwnership);
  const forbiddenCards = useStore((state) => selectForbiddenCards(state, deck));
  const cardOwnedCount = useStore(selectCardOwnedCount);

  const quantities = resolveQuantities(grouping);

  const renderCard = useCallback(
    (card: Card) => {
      const listCardProps = getListCardProps?.(card);

      return (
        <ListCard
          {...listCardProps}
          annotation={deck.annotations?.[card.code]}
          isForbidden={
            forbiddenCards.find(
              (x) =>
                (x.code === card.code || x.code === card.duplicate_of_code) &&
                x.target === grouping.id,
            ) != null
          }
          card={card}
          isRemoved={grouping.quantities?.[card.code] === 0}
          isIgnored={deck.ignoreDeckLimitSlots?.[card.code]}
          limitOverride={getDeckLimitOverride(deck, card.code)}
          key={card.code}
          omitBorders
          onChangeCardQuantity={
            grouping.static ? undefined : listCardProps?.onChangeCardQuantity
          }
          ownedCount={canCheckOwnership ? cardOwnedCount(card) : undefined}
          quantity={grouping.quantities?.[card.code] ?? 0}
        />
      );
    },
    [
      canCheckOwnership,
      cardOwnedCount,
      deck,
      forbiddenCards,
      grouping.id,
      grouping.quantities,
      grouping.static,
      getListCardProps,
    ],
  );

  const seenParents = new Set<string>();

  return (
    <>
      {grouping.data.map((group) => {
        if (!group.cards.length) return null;

        const parents = resolveParents(grouping, group).filter(
          (parent) => !seenParents.has(parent.key),
        );

        for (const parent of parents) {
          seenParents.add(parent.key);
        }

        return (
          <div key={group.key}>
            {parents.map((parent) => (
              <h2 className={css["title"]} key={parent.key}>
                <GroupLabel
                  className={css["label"]}
                  type={parent.type.split("|").at(-1) as string}
                  segment={parent.key.split("|").at(-1) as string}
                  metadata={metadata}
                />
                <GroupQuantity quantity={quantities.get(parent.key) ?? 0} />
              </h2>
            ))}
            {!isGroupCollapsed(group) && (
              <h3 className={css["subtitle"]}>
                <GroupLabel
                  className={css["label"]}
                  type={group.type.split("|").at(-1) as string}
                  segment={group.key.split("|").at(-1) as string}
                  metadata={metadata}
                />
                <GroupQuantity quantity={quantities.get(group.key) ?? 0} />
              </h3>
            )}
            {group.cards.map(renderCard)}
          </div>
        );
      })}
    </>
  );
}

function GroupQuantity(props: { quantity: number }) {
  return <span className={css["group-quantity"]}>{props.quantity}</span>;
}
