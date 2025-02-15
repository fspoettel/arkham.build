import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { AvailableUpgrades } from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import { assert } from "@/utils/assert";
import { useCallback } from "react";

type Props = {
  availableUpgrades: AvailableUpgrades;
  card: Card;
  deck: ResolvedDeck;
};

export function QuickUpgrade(props: Props) {
  const { availableUpgrades, card, deck } = props;

  const upgradeCard = useStore((state) => state.upgradeCard);

  const onUpgradeCard = useCallback(() => {
    const upgrades = availableUpgrades[card.code];
    assert(upgrades.length, "No upgrades available for card");

    if (upgrades.length === 1) {
      upgradeCard(deck.id, card.code, upgrades[0].code, 1);
    } else {
      console.log("TODO: Show upgrade dialog");
    }
  }, [availableUpgrades, card, deck.id, upgradeCard]);

  return (
    <Button iconOnly tooltip="Upgrade card" onClick={onUpgradeCard}>
      <i className="icon icon-upgrade" />
    </Button>
  );
}
