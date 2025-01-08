import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectLimitedSlotOccupation } from "@/store/selectors/decks";
import { LimitedCardGroup } from "../limited-card-group";
import { ListCard } from "../list-card/list-card";

export function LimitedSlots(props: { deck: ResolvedDeck }) {
  const limitedSlots = useStore((state) =>
    selectLimitedSlotOccupation(state, props.deck),
  );

  if (!limitedSlots?.length) return null;

  console.log(props.deck);

  return (
    <>
      {limitedSlots?.map((entry) => (
        <LimitedCardGroup
          key={entry.index}
          count={{
            limit: entry.option.limit ?? 0,
            total: entry.entries.reduce(
              (acc, { quantity }) => acc + quantity,
              0,
            ),
          }}
          entries={entry.entries}
          renderCard={({ card, quantity }) => (
            <ListCard
              annotation={props.deck.annotations[card.code]}
              card={card}
              key={card.code}
              quantity={quantity}
            />
          )}
          title={entry.option.name ?? "Limited slots"}
        />
      ))}
    </>
  );
}
