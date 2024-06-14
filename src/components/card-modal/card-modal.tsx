import { useCallback } from "react";

import { useStore } from "@/store";
import {
  getRelatedCardQuantity,
  getRelatedCards,
} from "@/store/lib/resolve-card";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { selectActiveDeck, selectCanEditDeck } from "@/store/selectors/decks";
import { formatRelationTitle } from "@/utils/formatting";
import { useMedia } from "@/utils/use-media";

import css from "./card-modal.module.css";

import { Card } from "../card/card";
import { CardSet } from "../cardset";
import { Customizations } from "../customizations/customizations";
import { CustomizationsEditor } from "../customizations/customizations-editor";
import { Button } from "../ui/button";
import { useDialogContext } from "../ui/dialog.hooks";
import { Modal } from "../ui/modal";
import { CardModalQuantities } from "./card-modal-quantities";

type Props = {
  code: string;
};

export function CardModal({ code }: Props) {
  const modalContext = useDialogContext();

  const onCloseModal = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  const activeDeck = useStore(selectActiveDeck);
  const canEdit = useStore(selectCanEditDeck);

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code, true),
  );

  const showQuantities =
    !!activeDeck && cardWithRelations?.card.type_code !== "investigator";
  const showExtraQuantities = activeDeck?.hasExtraDeck;

  const canRenderFull = useMedia("(min-width: 45rem)");

  if (!cardWithRelations) return null;

  const related = getRelatedCards(cardWithRelations);

  const cardNode = (
    <>
      <Card
        canToggleBackside
        resolvedCard={cardWithRelations}
        size={canRenderFull ? "full" : "compact"}
      >
        {cardWithRelations.card.customization_options ? (
          activeDeck ? (
            <CustomizationsEditor
              activeDeck={activeDeck}
              canEdit={canEdit}
              card={cardWithRelations.card}
            />
          ) : (
            <Customizations card={cardWithRelations.card} />
          )
        ) : undefined}
      </Card>
      {!!related.length && (
        <div className={css["related"]}>
          {related.map(([key, value]) => {
            const cards = Array.isArray(value) ? value : [value];
            return (
              <CardSet
                canOpenModal={false}
                key={key}
                set={{
                  title: formatRelationTitle(key),
                  cards,
                  id: key,
                  selected: false,
                  quantities: getRelatedCardQuantity(key, cards),
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <Modal
      actions={
        <Button
          as="a"
          href={`/card/${cardWithRelations.card.code}`}
          tabIndex={2}
          target="_blank"
        >
          Open card page
        </Button>
      }
      onClose={onCloseModal}
      size="52rem"
    >
      {showQuantities ? (
        <div className={css["container"]}>
          <div>{cardNode}</div>
          {showQuantities && (
            <CardModalQuantities
              canEdit={canEdit}
              card={cardWithRelations.card}
              onClickBackground={onCloseModal}
              showExtraQuantities={showExtraQuantities}
            />
          )}
        </div>
      ) : (
        cardNode
      )}
    </Modal>
  );
}
