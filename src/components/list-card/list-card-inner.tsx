import { cx } from "@/utils/cx";
import type { ReferenceType } from "@floating-ui/react";
import { FileWarning, Star } from "lucide-react";
import { useCallback } from "react";

import type { Card } from "@/store/services/queries.types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { SPECIAL_CARD_CODES } from "@/utils/constants";
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
  className?: string;
  disableKeyboard?: boolean;
  disableModalOpen?: boolean;
  figureRef?: (node: ReferenceType | null) => void;
  isActive?: boolean;
  isForbidden?: boolean;
  isIgnored?: number;
  isRemoved?: boolean;
  omitBorders?: boolean;
  omitThumbnail?: boolean;

  onChangeCardQuantity?: (
    code: string,
    quantity: number,
    limit: number,
  ) => void;
  ownedCount?: number;
  quantity?: number;
  referenceProps?: React.ComponentProps<"div">;
  size?: "sm" | "investigator";
  showInvestigatorIcons?: boolean;

  renderAction?: (card: Card) => React.ReactNode;
  renderExtra?: (card: Card) => React.ReactNode;
  renderAfter?: (card: Card, quantity?: number) => React.ReactNode;
};

export function ListCardInner(props: Props) {
  const {
    as = "div",
    card,
    className,
    disableKeyboard,
    disableModalOpen,
    figureRef,
    isActive,
    isForbidden,
    isIgnored,
    isRemoved,
    omitBorders,
    omitThumbnail,
    onChangeCardQuantity,
    ownedCount,
    quantity,
    referenceProps,
    renderAction,
    renderExtra,
    renderAfter,
    showInvestigatorIcons,
    size,
  } = props;

  const modalContext = useCardModalContext();

  const ignoredCount = isIgnored ?? 0;

  const colorCls = getCardColor(card);
  const Element = as as React.JSX.ElementType;

  const onQuantityChange = useCallback(
    (val: number, limit: number) => {
      onChangeCardQuantity?.(card.code, val, limit);
    },
    [onChangeCardQuantity, card.code],
  );

  const openModal = useCallback(() => {
    modalContext.setOpen({ code: card.code });
  }, [modalContext, card.code]);

  const limit = card.deck_limit || card.quantity;

  return (
    <Element
      className={cx(
        css["listcard"],
        size && css[size],
        !omitBorders && css["borders"],
        isRemoved && quantity === 0 && css["removed"],
        isForbidden && css["forbidden"],
        isActive && css["active"],
        className,
      )}
      data-testid={`listcard-${card.code}`}
    >
      <div className={css["listcard-main"]}>
        {!!renderAction && renderAction(card)}

        {quantity != null && (
          <>
            {onChangeCardQuantity ? (
              <QuantityInput
                limit={limit}
                onValueChange={onQuantityChange}
                tabIndex={disableKeyboard ? -1 : undefined}
                value={quantity}
              />
            ) : (
              <QuantityOutput
                data-testid="listcard-quantity"
                value={quantity}
              />
            )}
          </>
        )}

        <figure className={css["content"]} ref={figureRef}>
          {!omitThumbnail && card.imageurl && (
            <button
              onClick={disableModalOpen ? undefined : openModal}
              tabIndex={-1}
              type="button"
            >
              <div className={css["thumbnail"]} {...referenceProps}>
                <CardThumbnail card={card} />
              </div>
            </button>
          )}

          {card.faction_code !== "mythos" && (
            <div className={cx(css["icon"], colorCls)}>
              <CardIcon card={card} />
            </div>
          )}

          <figcaption className={css["caption"]}>
            <div className={cx(css["name-container"], colorCls)}>
              <h4 className={css["name"]} {...referenceProps}>
                <button
                  onClick={disableModalOpen ? undefined : openModal}
                  tabIndex={-1}
                  type="button"
                  data-testid="listcard-title"
                >
                  {card.real_name}
                </button>
              </h4>

              {ownedCount != null &&
                card.code !== SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS &&
                (!ownedCount ||
                  (quantity != null && ownedCount < quantity)) && (
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
                    <span
                      className={css["ignored"]}
                      data-testid="listcard-ignored"
                    >
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
              {card.type_code !== "investigator" && !card.subtype_code && (
                <MulticlassIcons card={card} className={css["multiclass"]} />
              )}

              {card.parallel && <i className="icon-parallel" />}

              {hasSkillIcons(card) && <SkillIcons card={card} />}

              {!!card.taboo_set_id && (
                <span className={cx(css["taboo"], "color-taboo")}>
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
      </div>

      {!!renderAfter && renderAfter(card, quantity)}
    </Element>
  );
}
