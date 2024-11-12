import { CustomizableDiff } from "@/components/deck-display/deck-history/customizable-diff";
import { SlotDiff } from "@/components/deck-display/deck-history/slot-diff";
import { ListCard } from "@/components/list-card/list-card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Scroller } from "@/components/ui/scroller";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectLatestUpgrade } from "@/store/selectors/decks";
import type { Card } from "@/store/services/queries.types";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { isStaticInvestigator } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { useAccentColor } from "@/utils/use-accent-color";
import {
  ArrowLeftToLineIcon,
  FlameIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "lucide-react";
import { useCallback } from "react";
import css from "./latest-upgrade.module.css";

type Props = {
  deck: ResolvedDeck;
  currentTab?: Tab;
  overflowScroll?: boolean;
  readonly?: boolean;
};

export function LatestUpgrade(props: Props) {
  const { currentTab, overflowScroll, readonly, deck } = props;

  const accentColor = useAccentColor(deck.investigatorBack.card.faction_code);

  const latestUpgrade = useStore((state) => selectLatestUpgrade(state, deck));

  const updateXpAdjustment = useStore((state) => state.updateXpAdjustment);
  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  const onIcrement = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.stopPropagation();
      updateXpAdjustment(deck.id, (latestUpgrade?.xpAdjustment ?? 0) + 1);
    },
    [deck.id, latestUpgrade?.xpAdjustment, updateXpAdjustment],
  );

  const onDecrement = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.stopPropagation();
      updateXpAdjustment(deck.id, (latestUpgrade?.xpAdjustment ?? 0) - 1);
    },
    [deck.id, latestUpgrade?.xpAdjustment, updateXpAdjustment],
  );

  const onAddExile = useCallback(
    (card: Card, quantity: number) => {
      if (!currentTab) return;
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

  const { differences, xpSpent, xpAdjustment, xp } = latestUpgrade;

  const hasChanges =
    differences.slots.length ||
    differences.extraSlots.length ||
    differences.exileSlots.length ||
    differences.customizations.length;

  const staticInvestigator = isStaticInvestigator(deck.investigatorBack.card);

  const contentNode = (
    <div className={css["content-row"]}>
      {hasChanges ? (
        <>
          <SlotDiff title="Deck" differences={differences.slots} size="sm" />
          <SlotDiff
            title="Extra deck"
            differences={differences.extraSlots}
            size="sm"
          />
          <SlotDiff
            title="Exiled cards"
            differences={differences.exileSlots}
            size="sm"
          />
          <CustomizableDiff
            title="Customizations"
            differences={differences.customizations}
            size="sm"
          />
        </>
      ) : (
        "No changes."
      )}
    </div>
  );

  return (
    <div
      className={cx(
        css["container"],
        overflowScroll && css["scroll"],
        readonly && css["readonly"],
      )}
      style={accentColor}
    >
      <Progress max={xp + xpAdjustment} value={xpSpent} validateInRange />
      <Collapsible
        className={css["collapsible"]}
        data-testid="latest-upgrade"
        omitBorder
        omitPadding
        triggerReversed
        title={
          <div className={css["title"]}>
            <div className={css["row"]} data-testid="latest-upgrade-summary">
              <i className="icon-xp-bold" />
              <strong>{xpSpent}</strong> of{" "}
              <span className={css["quantity"]}>
                <strong>{xp + xpAdjustment}</strong>
                XP
              </span>{" "}
              spent
              {!readonly && (
                <>
                  <Button
                    disabled={xp + xpAdjustment <= 0}
                    size="none"
                    data-testid="latest-upgrade-xp-decrement"
                    variant="bare"
                    onClick={onDecrement}
                  >
                    <MinusCircleIcon />
                  </Button>
                  <Button
                    data-testid="latest-upgrade-xp-increment"
                    size="none"
                    variant="bare"
                    onClick={onIcrement}
                  >
                    <PlusCircleIcon />
                  </Button>
                </>
              )}
              {xpAdjustment
                ? ` (${xpAdjustment >= 0 ? "+" : ""}${xpAdjustment})`
                : ""}
            </div>
            {!readonly && !!Object.keys(deck.exileSlots).length && (
              <Popover placement="right-start">
                <PopoverTrigger asChild>
                  <Button
                    iconOnly
                    data-testid="latest-upgrade-exile"
                    onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
                      evt.stopPropagation();
                    }}
                    variant="bare"
                  >
                    <FlameIcon /> Exile
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <article className={css["exile"]}>
                    <header>
                      <h3>Exiled cards</h3>
                    </header>
                    <ol>
                      {Object.entries(deck.exileSlots).map(
                        ([code, quantity]) => (
                          <ListCard
                            key={code}
                            card={deck.cards.exileSlots[code].card}
                            quantity={quantity}
                            renderCardExtra={
                              !readonly
                                ? (card) => (
                                    <Button
                                      iconOnly
                                      disabled={staticInvestigator}
                                      data-testid={`latest-upgrade-exile-${code}-add`}
                                      onClick={(
                                        evt: React.MouseEvent<HTMLButtonElement>,
                                      ) => {
                                        evt.stopPropagation();
                                        onAddExile(card, quantity);
                                      }}
                                      tooltip="Add to current list"
                                    >
                                      <ArrowLeftToLineIcon />
                                    </Button>
                                  )
                                : undefined
                            }
                          />
                        ),
                      )}
                    </ol>
                  </article>
                </PopoverContent>
              </Popover>
            )}
          </div>
        }
      >
        <CollapsibleContent className={css["content"]}>
          {!overflowScroll ? contentNode : <Scroller>{contentNode}</Scroller>}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
