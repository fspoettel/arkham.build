import type { ReferenceType } from "@floating-ui/react";
import clsx from "clsx";
import { FileWarning, Star } from "lucide-react";
import { useCallback } from "react";

import type { Card } from "@/store/services/queries.types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { CardHealth } from "../card-health";
import { CardIcon } from "../card-icon";
import { CardThumbnail } from "../card/card-thumbnail";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons/skill-icons";
import { SkillIconsInvestigator } from "../skill-icons/skill-icons-investigator";
import { QuantityInput } from "../ui/quantity-input";
import { QuantityOutput } from "../ui/quantity-output";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type Props = {
  isActive?: boolean;
  as?: "li" | "div";
  canIndicateRemoval?: boolean;
  canCheckOwnership?: boolean;
  card: Card;
  className?: string;
  disableKeyboard?: boolean;
  figureRef?: (node: ReferenceType | null) => void;
  isForbidden?: boolean;
  isIgnored?: number;
  omitBorders?: boolean;
  onOpenModal?: (code: string) => void;
  onChangeCardQuantity?: (code: string, quantity: number) => void;
  owned?: number;
  quantities?: {
    [code: string]: number;
  };
  referenceProps?: React.ComponentProps<"div">;
  renderAction?: (card: Card) => React.ReactNode;
  renderExtra?: (card: Card) => React.ReactNode;
  size?: "sm";
  showInvestigatorIcons?: boolean;
};

export function ListCardInner({
  isActive,
  as = "div",
  card,
  disableKeyboard,
  canIndicateRemoval,
  canCheckOwnership,
  className,
  figureRef,
  isForbidden,
  isIgnored,
  onChangeCardQuantity,
  onOpenModal,
  omitBorders,
  owned,
  referenceProps,
  renderAction,
  renderExtra,
  quantities,
  showInvestigatorIcons,
  size,
}: Props) {
  const quantity = quantities ? quantities[card.code] ?? 0 : 0;

  const ownedCount = owned ?? 0;
  const ignoredCount = isIgnored ?? 0;

  const colorCls = getCardColor(card);
  const Element = as as React.JSX.ElementType;

  const onQuantityChange = useCallback(
    (val: number) => {
      onChangeCardQuantity?.(card.code, val);
    },
    [onChangeCardQuantity, card.code],
  );

  const openModal = useCallback(() => {
    if (onOpenModal) {
      onOpenModal(card.code);
    }
  }, [onOpenModal, card.code]);

  return (
    <Element
      className={clsx(
        css["listcard"],
        size && css[size],
        !omitBorders && css["borders"],
        canIndicateRemoval && quantity === 0 && css["removed"],
        isForbidden && css["forbidden"],
        isActive && css["active"],
        className,
      )}
    >
      {!!renderAction && renderAction(card)}

      {!!quantities && (
        <>
          {onChangeCardQuantity ? (
            <QuantityInput
              limit={card.deck_limit || card.quantity}
              onValueChange={onQuantityChange}
              tabIndex={disableKeyboard ? -1 : undefined}
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

            {canCheckOwnership &&
              owned != null &&
              card.code !== "01000" &&
              (!owned || ownedCount < quantity) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={css["ownership"]}>
                      <FileWarning />
                    </span>
                  </TooltipTrigger>
                  {!!quantity && (
                    <TooltipContent>
                      <p>
                        Unavailable: {quantity - ownedCount} of {quantity}
                      </p>
                    </TooltipContent>
                  )}
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

          {renderExtra && (
            <div className={css["meta"]}>{renderExtra(card)}</div>
          )}
        </figcaption>
      </figure>
    </Element>
  );
}
