import type { ReferenceType } from "@floating-ui/react";
import clsx from "clsx";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { useCallback } from "react";

import { useStore } from "@/store";
import type { Card } from "@/store/services/types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { useCardModalContext } from "../card-modal/card-modal-context";
import { CardHealth } from "../card/card-health";
import { CardIcon } from "../card/card-icon";
import { CardThumbnail } from "../card/card-thumbnail";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons";
import { SkillIconsInvestigator } from "../skill-icons-investigator";
import { QuantityInput } from "../ui/quantity-input";
import { QuantityOutput } from "../ui/quantity-output";

export type Props = {
  as?: "li" | "div";
  card: Card;
  canEdit?: boolean;
  canIndicateRemoval?: boolean;
  canOpenModal?: boolean;
  canShowQuantities?: boolean;
  canShowInvestigatorIcons?: boolean;
  canShowParallel?: boolean;
  canShowSubname?: boolean;
  className?: string;
  figureRef?: (node: ReferenceType | null) => void;
  forbidden?: boolean;
  omitBorders?: boolean;
  size?: "sm";
  onToggleModal?: () => void;
  referenceProps?: ComponentProps<"div">;
  renderThumbnail?: (el: ReactNode) => ReactNode;
  quantities?: Record<string, number> | null;
  renderName?: (el: ReactNode) => ReactNode;
};

export function ListCardInner({
  as = "div",
  card,
  canEdit,
  canIndicateRemoval,
  canOpenModal,
  canShowQuantities,
  canShowSubname = true,
  canShowParallel = true,
  className,
  figureRef,
  forbidden,
  omitBorders,
  referenceProps,
  quantities,
  canShowInvestigatorIcons,
  size,
}: Props) {
  const modalContext = useCardModalContext();

  const quantity = quantities ? quantities[card.code] ?? 0 : 0;

  const changeCardQuantity = useStore((state) => state.changeCardQuantity);

  const colorCls = getCardColor(card);
  const Element = as as ElementType;

  const onQuantityChange = useCallback(
    (val: number) => {
      changeCardQuantity(card.code, val);
    },
    [changeCardQuantity, card.code],
  );

  const openModal = useCallback(() => {
    if (canOpenModal && modalContext) {
      modalContext.setOpen({
        code: card.code,
        canEdit,
        canShowQuantities,
      });
    }
  }, [canShowQuantities, card.code, canEdit, modalContext, canOpenModal]);

  return (
    <Element
      className={clsx(
        css["listcard"],
        !omitBorders && css["borders"],
        size && css[size],
        forbidden && css["forbidden"],
        className,
        canIndicateRemoval && quantity === 0 && css["removed"],
      )}
    >
      {canShowQuantities && (
        <>
          {canEdit ? (
            <QuantityInput
              limit={card.deck_limit ?? card.quantity}
              onValueChange={onQuantityChange}
              value={quantity ?? 0}
            />
          ) : (
            <QuantityOutput value={quantity} />
          )}
        </>
      )}

      <figure className={css["listcard-inner"]} ref={figureRef}>
        {card.imageurl && (
          <button onClick={openModal} tabIndex={-1}>
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
            <button onClick={openModal} tabIndex={-1}>
              {card.real_name}
            </button>
          </h4>

          <div className={css["listcard-meta"]}>
            {canShowParallel && card.parallel && (
              <i className="icon-parallel" />
            )}

            <MulticlassIcons
              card={card}
              className={css["listcard-multiclass"]}
            />

            {hasSkillIcons(card) && <SkillIcons card={card} />}

            {!!card.taboo_set_id && (
              <span className={clsx(css["listcard-taboo"], "color-taboo")}>
                {card.taboo_xp && <ExperienceDots xp={card.taboo_xp} />}
                <i className="icon-tablet icon-layout color-taboo" />
              </span>
            )}
            {canShowSubname && card.real_subname && (
              <h5 className={css["listcard-subname"]}>{card.real_subname}</h5>
            )}

            {canShowInvestigatorIcons && card.type_code === "investigator" && (
              <>
                <CardHealth
                  className={css["listcard-investigator-health"]}
                  health={card.health}
                  sanity={card.sanity}
                />
                <SkillIconsInvestigator
                  card={card}
                  className={css["listcard-investigator-skills"]}
                  iconClassName={css["listcard-investigator-skill"]}
                />
              </>
            )}
          </div>
        </figcaption>
      </figure>
    </Element>
  );
}
