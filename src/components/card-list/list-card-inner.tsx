import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { ElementType, ReactNode } from "react";
import { useCallback } from "react";

import { useStore } from "@/store";
import type { Card } from "@/store/services/types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { CardIcon } from "../card/card-icon";
import { CardThumbnail } from "../card/card-thumbnail";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons";
import { Button } from "../ui/button";
import { useDialogContextUnchecked } from "../ui/dialog";

export type Props = {
  as?: "li" | "div";
  card: Card;
  canEdit?: boolean;
  canOpenModal?: boolean;
  canShowQuantity?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  figureRef?: any;
  forbidden?: boolean;
  omitBorders?: boolean;
  size?: "sm";
  onToggleModal?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referenceProps?: Record<string, any>;
  renderThumbnail?: (el: ReactNode) => ReactNode;
  quantities?: Record<string, number> | null;
  renderName?: (el: ReactNode) => ReactNode;
};

export function ListCardInner({
  as = "div",
  card,
  canEdit,
  canOpenModal,
  canShowQuantity,
  className,
  figureRef,
  forbidden,
  omitBorders,
  referenceProps,
  quantities,
  size,
}: Props) {
  const modalContext = useDialogContextUnchecked();

  const quantity = quantities ? quantities[card.code] ?? 0 : 0;

  const changeCardQuantity = useStore((state) => state.changeCardQuantity);

  const colorCls = getCardColor(card);
  const Element = as as ElementType;

  const decrementCardQuantity = useCallback(() => {
    changeCardQuantity(card.code, -1);
  }, [changeCardQuantity, card.code]);

  const incrementCardQuantity = useCallback(() => {
    changeCardQuantity(card.code, 1);
  }, [changeCardQuantity, card.code]);

  const openModal = useCallback(() => {
    if (canOpenModal && modalContext) modalContext.setOpen(true);
  }, [canOpenModal, modalContext]);

  return (
    <Element
      className={clsx(
        css["listcard"],
        !omitBorders && css["borders"],
        size && css[size],
        forbidden && css["forbidden"],
        className,
      )}
    >
      {canShowQuantity && (
        <div className={css["listcard-quantity-row"]}>
          {canEdit ? (
            <div className={css["listcard-quantity-input"]}>
              <Button
                onClick={decrementCardQuantity}
                disabled={quantity === 0}
                variant="bare"
                size="sm"
              >
                <MinusIcon />
              </Button>
              <strong className={css["listcard-quantity"]}>
                {quantity ?? 0}
              </strong>
              <Button
                onClick={incrementCardQuantity}
                disabled={(quantity ?? 0) >= (card.deck_limit || card.quantity)}
                variant="bare"
                size="sm"
              >
                <PlusIcon />
              </Button>
            </div>
          ) : (
            <>
              <strong className={css["listcard-quantity"]}>{quantity}</strong>
              <span className={css["listcard-quantity-x"]}>×</span>
            </>
          )}
        </div>
      )}

      <figure className={css["listcard-inner"]} ref={figureRef}>
        {card.imageurl && (
          <button tabIndex={-1} onClick={openModal}>
            <div className={css["listcard-thumbnail"]} {...referenceProps}>
              <CardThumbnail card={card} />
            </div>
          </button>
        )}

        {card.faction_code !== "mythos" && (
          <div className={clsx(css["listcard-icon"], colorCls)}>
            <CardIcon card={card} />
          </div>
        )}

        <figcaption className={css["listcard-caption"]}>
          <h4
            className={clsx(css["listcard-name"], colorCls)}
            {...referenceProps}
          >
            <button tabIndex={-1} onClick={openModal}>
              {card.real_name}
            </button>
          </h4>

          <div className={css["listcard-meta"]}>
            {card.parallel && <i className="encounters-parallel" />}
            <MulticlassIcons
              className={css["listcard-multiclass"]}
              card={card}
            />
            {hasSkillIcons(card) && <SkillIcons card={card} />}

            {!!card.taboo_set_id && (
              <span className={clsx(css["listcard-taboo"], "color-taboo")}>
                {card.taboo_xp && <ExperienceDots xp={card.taboo_xp} />}
                <i className="icon-tablet icon-layout color-taboo" />
              </span>
            )}
            {card.real_subname && (
              <h5 className={css["listcard-subname"]}>{card.real_subname}</h5>
            )}
          </div>
        </figcaption>
      </figure>
    </Element>
  );
}
