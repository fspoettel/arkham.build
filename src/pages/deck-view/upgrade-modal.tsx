import { useDialogContext } from "@/components/ui/dialog.hooks";
import { Modal, ModalContent } from "@/components/ui/modal";
import { useCallback, useMemo, useState } from "react";

import { ListCard } from "@/components/list-card/list-card";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { decodeExileSlots } from "@/utils/card-utils";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { range } from "@/utils/range";
import { useAccentColor } from "@/utils/use-accent-color";
import { useLocation } from "wouter";

import { Scroller } from "@/components/ui/scroller";
import css from "./upgrade-modal.module.css";

type Props = {
  deck: ResolvedDeck;
};

function toExilable(
  deck: ResolvedDeck,
  slotKey: "slots" | "extraSlots",
  burnAfterReading?: boolean,
) {
  const slots = deck[slotKey];
  if (!slots) return [];

  return Object.entries(slots).reduce<{ card: Card; limit: number }[]>(
    (acc, [code, limit]) => {
      const card = deck.cards[slotKey][code].card;
      if (
        burnAfterReading &&
        !card.permanent &&
        card.xp != null &&
        !deck.ignoreDeckLimitSlots?.[code]
      ) {
        acc.push({ card, limit });
      } else if (card.exile) {
        acc.push({ card, limit });
      }

      return acc;
    },
    [],
  );
}

function selectExilableCards(deck: ResolvedDeck) {
  const burnAfterReading = !!deck.slots[SPECIAL_CARD_CODES.BURN_AFTER_READING];

  const exilable: { card: Card; limit: number }[] = [];

  exilable.push(...toExilable(deck, "slots", burnAfterReading));
  exilable.push(...toExilable(deck, "extraSlots", burnAfterReading));

  return exilable;
}

export function UpgradeModal(props: Props) {
  const { deck } = props;
  const [, navigate] = useLocation();
  const toast = useToast();

  const upgradeDeck = useStore((state) => state.upgradeDeck);
  const [xp, setXp] = useState("");

  const exilableCards = selectExilableCards(deck);
  const [exileString, setExileString] = useState("");

  const modalContext = useDialogContext();

  const onCloseModal = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  const onUpgrade = useCallback(() => {
    const id = upgradeDeck(deck.id, xp ? +xp : 0, exileString);

    onCloseModal();

    toast.show({
      duration: 3000,
      children: "Deck upgrade successful.",
      variant: "success",
    });
    navigate(`/deck/view/${id}`);
  }, [deck.id, upgradeDeck, xp, onCloseModal, navigate, toast, exileString]);

  const onXpChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setXp(evt.target.value);
  }, []);

  const exiledQuantities = useMemo(
    () => decodeExileSlots(exileString),
    [exileString],
  );

  const onExileChange = useCallback(
    (code: string, quantity: number, limit: number) => {
      const cardQuantity = (exiledQuantities[code] ?? 0) + quantity;

      if (cardQuantity <= limit) {
        setExileString((prev) =>
          prev
            .split(",")
            .filter((x) => x && x !== code)
            .concat(range(0, cardQuantity).map(() => code))
            .join(","),
        );
      }
    },
    [exiledQuantities],
  );

  const cssVariables = useAccentColor(
    deck.cards.investigator.card.faction_code,
  );

  return (
    <Modal data-testid="upgrade-modal" onClose={onCloseModal} size="45rem">
      <ModalContent
        title={
          <>
            <i className="icon-xp-bold" />
            Upgrade deck with XP
          </>
        }
        footer={
          <>
            <Button disabled={xp === ""} onClick={onUpgrade} variant="primary">
              Upgrade
            </Button>
            <Button onClick={onCloseModal}>Cancel</Button>
          </>
        }
        style={cssVariables}
      >
        <div className={css["content"]}>
          <Field bordered full>
            <FieldLabel htmlFor="xp-gained">XP gained</FieldLabel>
            <input
              // biome-ignore lint/a11y/noAutofocus: this is a modal.
              autoFocus
              onChange={onXpChange}
              min="0"
              required
              type="number"
              name="xp-gained"
              value={xp}
            />
          </Field>
          {!!exilableCards.length && (
            <Field bordered>
              <FieldLabel htmlFor="xp-gained">Exiled Cards</FieldLabel>
              <Scroller className={css["exile"]}>
                <ul>
                  {exilableCards.map(({ card, limit }) => (
                    <ListCard
                      as="li"
                      key={card.code}
                      card={card}
                      limitOverride={limit}
                      onChangeCardQuantity={onExileChange}
                      quantity={exiledQuantities[card.code] ?? 0}
                      size="sm"
                    />
                  ))}
                </ul>
              </Scroller>
            </Field>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
