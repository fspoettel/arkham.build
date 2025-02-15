import {
  Attachments,
  getMatchingAttachables,
} from "@/components/attachments/attachments";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectAvailableUpgrades } from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { isEmpty } from "@/utils/is-empty";
import css from "./deck-edit.module.css";
import { DrawBasicWeakness } from "./editor/draw-basic-weakness";
import { MoveToMainDeck } from "./editor/move-to-main-deck";

type Props = {
  canEdit?: boolean;
  deck: ResolvedDeck;
  card: Card;
  quantity: number | undefined;
  currentTab: Tab;
};

export function CardExtras(props: Props) {
  const { canEdit, card, deck, quantity, currentTab } = props;

  const availableUpgrades = useStore((state) =>
    selectAvailableUpgrades(
      state,
      deck,
      currentTab === "extraSlots" ? "extraSlots" : "slots",
    ),
  );

  if (currentTab === "meta" || currentTab === "ignoreDeckLimitSlots") {
    return null;
  }

  if (currentTab === "sideSlots") {
    return canEdit && quantity ? (
      <MoveToMainDeck card={card} deck={deck} />
    ) : null;
  }

  if (card.code === SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS) {
    return (
      <DrawBasicWeakness
        deckId={deck.id}
        quantity={quantity}
        targetDeck={mapTabToSlot(currentTab)}
      />
    );
  }

  const hasAttachable =
    currentTab === "slots" && !isEmpty(getMatchingAttachables(card, deck));

  const hasUpgrades = canEdit && !isEmpty(availableUpgrades[card.code]);

  if (!hasAttachable && !hasUpgrades) {
    return null;
  }

  return (
    <div className={css["extra-row"]}>
      {hasAttachable && <Attachments card={card} resolvedDeck={deck} />}
      {hasUpgrades && (
        <Button iconOnly tooltip="Upgrade card">
          <i className="icon icon-upgrade" />
        </Button>
      )}
    </div>
  );
}
