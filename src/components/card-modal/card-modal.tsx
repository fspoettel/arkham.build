import { Cross2Icon } from "@radix-ui/react-icons";
import type { MouseEvent } from "react";
import { useCallback, useRef } from "react";

import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { selectActiveDeck } from "@/store/selectors/decks";
import { useMedia } from "@/utils/use-media";

import css from "./card-modal.module.css";

import { Card } from "../card/card";
import { CardCustomizations } from "../card/customizations/card-customizations";
import { CardCustomizationsEdit } from "../card/customizations/card-customizations-edit";
import { Button } from "../ui/button";
import { useDialogContext } from "../ui/dialog";
import { CardModalQuantities } from "./card-modal-quantities";

type Props = {
  canEdit?: boolean;
  canShowQuantity?: boolean;
  code: string;
};

export function CardModal({ canEdit, canShowQuantity, code }: Props) {
  const actionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const modalContext = useDialogContext();

  const activeDeck = useStore(selectActiveDeck);

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code, true),
  );

  const onCloseModal = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  const onCloseModalOutside = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (evt.target === innerRef.current) onCloseModal();
    },
    [onCloseModal],
  );

  const onCloseActions = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (evt.target === actionRef.current) onCloseModal();
    },
    [onCloseModal],
  );

  const canRenderFull = useMedia("(min-width: 45rem)");

  if (!cardWithRelations) return null;

  const cardNode = (
    <Card
      canToggleBackside
      resolvedCard={cardWithRelations}
      size={canRenderFull ? "full" : "compact"}
    >
      {cardWithRelations.card.customization_options ? (
        activeDeck ? (
          <CardCustomizationsEdit
            activeDeck={activeDeck}
            card={cardWithRelations.card}
          />
        ) : (
          <CardCustomizations card={cardWithRelations.card} />
        )
      ) : undefined}
    </Card>
  );

  return (
    <div
      className={css["cardmodal"]}
      onClick={onCloseModalOutside}
      ref={innerRef}
    >
      <div className={css["cardmodal-inner"]}>
        <div
          className={css["cardmodal-actions"]}
          onClick={onCloseActions}
          ref={actionRef}
        >
          <Button
            tabIndex={2}
            as="a"
            target="_blank"
            href={`/card/${cardWithRelations.card.code}`}
          >
            Open card page
          </Button>
          <Button variant="bare" onClick={onCloseModal} tabIndex={1}>
            <Cross2Icon />
          </Button>
        </div>
        {canShowQuantity ? (
          <div className={css["cardmodal-row"]}>
            {cardNode}
            {canShowQuantity && (
              <CardModalQuantities
                canEdit={canEdit}
                card={cardWithRelations.card}
              />
            )}
          </div>
        ) : (
          cardNode
        )}
      </div>
    </div>
  );
}
