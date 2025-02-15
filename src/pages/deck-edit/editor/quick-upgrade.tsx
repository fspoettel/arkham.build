import { Card } from "@/components/card/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Modal, ModalContent } from "@/components/ui/modal";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import {
  type AvailableUpgrades,
  selectResolvedCardById,
} from "@/store/selectors/lists";
import type { Card as CardT } from "@/store/services/queries.types";
import type { Tab } from "@/store/slices/deck-edits.types";
import { assert } from "@/utils/assert";
import { FLOATING_PORTAL_ID } from "@/utils/constants";
import { FloatingPortal } from "@floating-ui/react";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";

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

  const onUpgradeCard = useCallback(() => {
    const upgrades = availableUpgrades[card.code];
    assert(upgrades.length, "No upgrades available for card");

    if (upgrades.length === 1) {
      upgradeCard(
        deck.id,
        card.code,
        upgrades[0].code,
        currentTab === "extraSlots" ? "extraSlots" : "slots",
      );
    } else {
      setDialogOpen(true);
    }
  }, [availableUpgrades, card, currentTab, deck.id, upgradeCard]);

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
        />
      )}
    </>
  );
}

function QuickUpgradeDialog(
  props: Props & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  },
) {
  const { availableUpgrades, card, deck, onOpenChange, open } = props;

  const resolvedCard = useStore((state) =>
    selectResolvedCardById(state, card.code, deck),
  );

  const resolvedUpgrades = useStore(
    useShallow((state) =>
      availableUpgrades[card.code].map((upgrade) =>
        selectResolvedCardById(state, upgrade.code, deck),
      ),
    ),
  );

  const upgradeCard = useStore((state) => state.upgradeCard);

  if (!resolvedCard) return null;

  return (
    <FloatingPortal id={FLOATING_PORTAL_ID}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Modal size="60rem">
          <ModalContent title={`Upgrade ${card.real_name}`}>
            <article>
              <header>
                <h3>Current level</h3>
              </header>
              <Card resolvedCard={resolvedCard} size="compact" />
            </article>

            {resolvedUpgrades.map((upgrade) => (
              <article key={upgrade.code}>
                <header>
                  <h3>Level {upgrade.card.xp}</h3>
                </header>
                <Card
                  key={upgrade.code}
                  resolvedCard={upgrade}
                  size="compact"
                />
              </article>
            ))}
          </ModalContent>
        </Modal>
      </Dialog>
    </FloatingPortal>
  );
}
