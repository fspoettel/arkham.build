import type { ReferenceType } from "@floating-ui/react";
import clsx from "clsx";
import { FileWarning, Star } from "lucide-react";
import { useCallback } from "react";

import { useStore } from "@/store";
import { selectCanEditDeck } from "@/store/selectors/decks";
import type { Card } from "@/store/services/queries.types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { CardHealth } from "../card-health";
import { CardIcon } from "../card-icon";
import { useCardModalContext } from "../card-modal/card-modal-context";
import { CardThumbnail } from "../card/card-thumbnail";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons/skill-icons";
import { SkillIconsInvestigator } from "../skill-icons/skill-icons-investigator";
import { QuantityInput } from "../ui/quantity-input";
import { QuantityOutput } from "../ui/quantity-output";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type Props = {
  as?: "li" | "div";
  card: Card;
  canIndicateRemoval?: boolean;
  canOpenModal?: boolean;
  canShowOwnership?: boolean;
  disableEdits?: boolean;
  showInvestigatorIcons?: boolean;
  className?: string;
  figureRef?: (node: ReferenceType | null) => void;
  forbidden?: boolean;
  ignored?: number;
  omitBorders?: boolean;
  owned?: number;
  size?: "sm";
  onToggleModal?: () => void;
  referenceProps?: React.ComponentProps<"div">;
  renderThumbnail?: (el: React.ReactNode) => React.ReactNode;
  quantities?: {
    [code: string]: number;
  };
  renderName?: (el: React.ReactNode) => React.ReactNode;
};

export function ListCardInner({
  as = "div",
  card,
  canIndicateRemoval,
  canOpenModal,
  canShowOwnership,
  className,
  disableEdits,
  figureRef,
  forbidden,
  ignored,
  omitBorders,
  owned,
  referenceProps,
  quantities,
  showInvestigatorIcons,
  size,
}: Props) {
  const modalContext = useCardModalContext();

  const quantity = quantities ? quantities[card.code] ?? 0 : 0;
  const ownedCount = owned ?? 0;
  const ignoredCount = ignored ?? 0;

  const canEdit = useStore(selectCanEditDeck);
  const changeCardQuantity = useStore((state) => state.changeCardQuantity);

  const colorCls = getCardColor(card);
  const Element = as as React.ElementType;

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
      });
    }
  }, [card.code, modalContext, canOpenModal]);

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
      {!!quantities && (
        <>
          {!disableEdits && canEdit ? (
            <QuantityInput
              limit={card.deck_limit || card.quantity}
              onValueChange={onQuantityChange}
              value={quantity ?? 0}
            />
          ) : (
            <QuantityOutput value={quantity} />
          )}
        </>
      )}

      <figure className={css["content"]} ref={figureRef}>
        {card.imageurl && (
          <button onClick={openModal} tabIndex={-1}>
            <div className={css["thumbnail"]} {...referenceProps}>
              <CardThumbnail card={card} />
            </div>
          </button>
        )}

        {card.faction_code !== "mythos" && (
          <div className={clsx(css["icon"], colorCls)}>
            <CardIcon card={card} />
          </div>
        )}

        <figcaption className={css["caption"]}>
          <div className={clsx(css["name-container"], colorCls)}>
            <h4 className={css["name"]} {...referenceProps}>
              <button onClick={openModal} tabIndex={-1}>
                {card.real_name}
              </button>
            </h4>

            {canShowOwnership &&
              card.code !== "01000" &&
              ownedCount < quantity && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={css["ownership"]}>
                      <FileWarning />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Unavailable: {quantity - ownedCount} of {quantity}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            {ignoredCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={css["ignored"]}>
                    <Star />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {ignoredCount}{" "}
                    {ignoredCount === 1 ? "copy does" : "copies do"} not count
                    towards the deck limit.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className={css["meta"]}>
            {!showInvestigatorIcons && card.parallel && (
              <i className="icon-parallel" />
            )}

            <MulticlassIcons card={card} className={css["multiclass"]} />

            {hasSkillIcons(card) && <SkillIcons card={card} />}

            {!!card.taboo_set_id && (
              <span className={clsx(css["taboo"], "color-taboo")}>
                {card.taboo_xp && <ExperienceDots xp={card.taboo_xp} />}
                <i className="icon-tablet icon-layout color-taboo" />
              </span>
            )}
            {!showInvestigatorIcons && card.real_subname && (
              <h5 className={css["subname"]}>{card.real_subname}</h5>
            )}

            {showInvestigatorIcons && card.type_code === "investigator" && (
              <>
                <CardHealth
                  className={css["investigator-health"]}
                  health={card.health}
                  sanity={card.sanity}
                />
                <SkillIconsInvestigator
                  card={card}
                  className={css["investigator-skills"]}
                  iconClassName={css["investigator-skill"]}
                />
              </>
            )}
          </div>
        </figcaption>
      </figure>
    </Element>
  );
}
