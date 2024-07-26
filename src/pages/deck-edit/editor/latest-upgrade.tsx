import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectLatestUpgrade } from "@/store/selectors/decks";

import { ListCard } from "@/components/list-card/list-card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Card } from "@/store/services/queries.types";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { ArrowLeftToLine, Flame, MinusCircle, PlusCircle } from "lucide-react";
import { useCallback } from "react";
import css from "./editor.module.css";

type Props = {
  currentTab: Tab;
  deck: ResolvedDeck;
};

export function LatestUpgrade(props: Props) {
  const { currentTab, deck } = props;
  const latestUpgrade = useStore((state) => selectLatestUpgrade(state, deck));

  const updateXpAdjustment = useStore((state) => state.updateXpAdjustment);
  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  const onIcrement = useCallback(() => {
    updateXpAdjustment(deck.id, (latestUpgrade?.xpAdjustment ?? 0) + 1);
  }, [deck.id, latestUpgrade?.xpAdjustment, updateXpAdjustment]);

  const onDecrement = useCallback(() => {
    updateXpAdjustment(deck.id, (latestUpgrade?.xpAdjustment ?? 0) - 1);
  }, [deck.id, latestUpgrade?.xpAdjustment, updateXpAdjustment]);

  const onAddExile = useCallback(
    (card: Card, quantity: number) => {
      updateCardQuantity(
        deck.id,
        card.code,
        quantity,
        card.deck_limit ?? card.quantity,
        mapTabToSlot(currentTab),
        "increment",
      );
    },
    [currentTab, deck.id, updateCardQuantity],
  );

  if (!latestUpgrade) return null;

  const { xpSpent, xpAdjustment, xp } = latestUpgrade;

  return (
    <div className={css["actions-upgrade"]}>
      <div className={css["actions-upgrade-row"]}>
        <i className="icon-xp-bold" />
        <strong>{xpSpent}</strong> of{" "}
        <span className={css["actions-upgrade-quantity"]}>
          <strong>{xp + xpAdjustment}</strong>
          XP
        </span>{" "}
        spent
        <Button
          disabled={xp + xpAdjustment <= 0}
          size="none"
          variant="bare"
          onClick={onDecrement}
        >
          <MinusCircle />
        </Button>
        <Button size="none" variant="bare" onClick={onIcrement}>
          <PlusCircle />
        </Button>
        {xpAdjustment
          ? ` (${xpAdjustment >= 0 ? "+" : ""}${xpAdjustment})`
          : ""}
      </div>
      {!!Object.keys(deck.exileSlots).length && (
        <Popover placement="right-start">
          <PopoverTrigger asChild>
            <Button iconOnly variant="bare">
              <Flame /> Exile
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <article className={css["exile"]}>
              <header>
                <h3>Exiled cards</h3>
              </header>
              <ol>
                {Object.entries(deck.exileSlots).map(([code, quantity]) => (
                  <ListCard
                    key={code}
                    card={deck.cards.exileSlots[code].card}
                    quantity={quantity}
                    renderAfter={(card) => (
                      <Button
                        iconOnly
                        onClick={() => onAddExile(card, quantity)}
                        tooltip="Add to current list"
                      >
                        <ArrowLeftToLine />
                      </Button>
                    )}
                  />
                ))}
              </ol>
            </article>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
