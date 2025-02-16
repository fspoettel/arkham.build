import { Card } from "@/components/card/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Modal, ModalContent } from "@/components/ui/modal";
import { QuantityInput } from "@/components/ui/quantity-input";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import {
  type AvailableUpgrades,
  selectResolvedCardById,
} from "@/store/selectors/lists";
import type { Card as CardT } from "@/store/services/queries.types";
import type { Tab } from "@/store/slices/deck-edits.types";
import { assert } from "@/utils/assert";
import { cardLimit } from "@/utils/card-utils";
import { FLOATING_PORTAL_ID } from "@/utils/constants";
import { useAccentColor } from "@/utils/use-accent-color";
import { FloatingPortal } from "@floating-ui/react";
import { DicesIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import css from "./quick-upgrade.module.css";

type Props = {
  availableUpgrades: AvailableUpgrades;
  card: CardT;
  currentTab: Tab;
  deck: ResolvedDeck;
};

export function QuickUpgrade(props: Props) {
  const { availableUpgrades, card, currentTab, deck } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const upgradeCard = useStore((state) => state.upgradeCard);

  const slots = currentTab === "extraSlots" ? "extraSlots" : "slots";

  const onUpgradeCard = useCallback(() => {
    const upgrades = availableUpgrades.upgrades[card.code];
    assert(upgrades.length, "No upgrades available for card");

    const canDirectUpgrade =
      upgrades.length === 1 &&
      !isShrewdAnalysisUpgrade(availableUpgrades, card, deck);

    if (canDirectUpgrade) {
      upgradeCard(deck.id, card.code, upgrades[0].code, slots);
    } else {
      setDialogOpen(true);
    }
  }, [availableUpgrades, card, slots, deck, upgradeCard]);

  return (
    <>
      <Button
        iconOnly
        tooltip="Upgrade card"
        onClick={onUpgradeCard}
        variant="bare"
      >
        <i className="icon icon-upgrade" />
      </Button>
      {dialogOpen && (
        <QuickUpgradeDialog
          {...props}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          slots={slots}
        />
      )}
    </>
  );
}

function QuickUpgradeDialog(
  props: Props & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slots: "slots" | "extraSlots";
  },
) {
  const { availableUpgrades, card, deck, onOpenChange, open, slots } = props;

  const accentColor = useAccentColor(card.faction_code);

  const resolvedCard = useStore((state) =>
    selectResolvedCardById(state, card.code, deck),
  );

  const resolvedUpgrades = useStore(
    useShallow((state) =>
      availableUpgrades.upgrades[card.code].map((upgrade) =>
        selectResolvedCardById(state, upgrade.code, deck),
      ),
    ),
  );

  const upgradeCard = useStore((state) => state.upgradeCard);

  const onChangeUpgradeQuantity = useCallback(() => {}, []);

  const onUseShrewdAnalysis = useCallback(() => {}, []);

  const shrewdAnalysisPossible = isShrewdAnalysisUpgrade(
    availableUpgrades,
    card,
    deck,
  );

  if (!resolvedCard) return null;

  return (
    <FloatingPortal id={FLOATING_PORTAL_ID}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <Modal size="60rem" onClose={() => onOpenChange(false)} open={open}>
            <ModalContent
              title={
                <>
                  <i className="icon icon-upgrade" />
                  <span>Upgrading {resolvedCard.card.real_name}</span>
                </>
              }
            >
              <div className={css["container"]} style={accentColor}>
                <article>
                  {shrewdAnalysisPossible && (
                    <Field helpText="The app will add an XP adjustment matching the received discount.">
                      <Button variant="primary">
                        <DicesIcon />
                        Use Shrewd Analysis
                      </Button>
                    </Field>
                  )}
                </article>
                <article>
                  <header className={css["header"]}>
                    <h3 className={css["title"]}>Current level</h3>
                  </header>
                  <Card
                    slotHeaderActions={
                      <QuantityInput
                        className={css["quantity"]}
                        disabled
                        limit={cardLimit(card)}
                        value={deck[slots]?.[card.code] ?? 0}
                      />
                    }
                    resolvedCard={resolvedCard}
                    size="compact"
                  />
                </article>
                <article>
                  <header className={css["header"]}>
                    <h3 className={css["title"]}>Upgrades</h3>
                  </header>
                  <ol className={css["upgrades"]}>
                    {resolvedUpgrades.map((upgrade) => {
                      if (!upgrade) return null;
                      return (
                        <li key={upgrade.card.code}>
                          <Card
                            resolvedCard={upgrade}
                            size="compact"
                            slotHeaderActions={
                              <QuantityInput
                                className={css["quantity"]}
                                limit={cardLimit(upgrade.card)}
                                value={deck[slots]?.[upgrade.card.code] ?? 0}
                              />
                            }
                          />
                        </li>
                      );
                    })}
                  </ol>
                </article>
              </div>
            </ModalContent>
          </Modal>
        </DialogContent>
      </Dialog>
    </FloatingPortal>
  );
}

function isShrewdAnalysisUpgrade(
  availableUpgrades: AvailableUpgrades,
  card: CardT,
  deck: ResolvedDeck,
) {
  return (
    availableUpgrades.shrewdAnalysisPresent &&
    deck.slots[card.code] > 1 &&
    ["Unidentified", "Untranslated"].some((trait) =>
      card.real_subname?.includes(trait),
    )
  );
}
