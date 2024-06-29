import clsx from "clsx";

import { useStore } from "@/store";
import type { CardSet as CardSetType } from "@/store/lib/types";
import {
  selectCanCheckOwnership,
  selectCardOwnedCount,
} from "@/store/selectors/shared";

import css from "./cardset.module.css";

import { ListCard } from "./list-card/list-card";
import { Checkbox } from "./ui/checkbox";

type Props = {
  onChangeCardQuantity?: (code: string, quantity: number) => void;
  onSelect?: (id: string) => void;
  set: CardSetType;
};

export function CardSet({ onChangeCardQuantity, onSelect, set }: Props) {
  const canCheckOwnership = useStore(selectCanCheckOwnership);
  const cardOwnedCount = useStore(selectCardOwnedCount);

  return (
    <article
      data-testid={`cardset-${set.id}`}
      className={clsx(css["cardset"], set.selected && css["selected"])}
    >
      <header className={css["cardset-header"]}>
        {onSelect ? (
          <Checkbox
            checked={set.selected}
            className={css["cardset-title"]}
            data-testid="cardset-select"
            disabled={!onSelect || !set.canSelect}
            id={`card-set-${set.id}`}
            label={set.title}
            onCheckedChange={() => onSelect?.(set.id)}
          />
        ) : (
          <h2 className={css["cardset-title"]}>{set.title}</h2>
        )}
      </header>
      <ul className={css["cardset-cards"]}>
        {set.cards.map(({ card }) => (
          <ListCard
            as="li"
            card={card}
            key={card.code}
            omitBorders
            onChangeCardQuantity={
              set.canSetQuantity ? onChangeCardQuantity : undefined
            }
            ownedCount={canCheckOwnership ? cardOwnedCount(card) : undefined}
            quantities={
              set.quantities
                ? { [card.code]: set.quantities[card.code] }
                : undefined
            }
          />
        ))}
      </ul>
    </article>
  );
}
