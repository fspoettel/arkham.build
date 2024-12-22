import type { Card } from "@/store/services/queries.types";
import {
  cardLimit,
  countExperience,
  getCardColor,
  hasImage,
  hasSkillIcons,
  isEnemyLike,
  parseCardTextHtml,
} from "@/utils/card-utils";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { cx } from "@/utils/cx";
import type { ReferenceType } from "@floating-ui/react";
import { FileWarningIcon, StarIcon } from "lucide-react";
import { useCallback } from "react";
import { CardHealth } from "../card-health";
import { CardIcon } from "../card-icon";
import { useCardModalContext } from "../card-modal/card-modal-context";
import { CardThumbnail } from "../card-thumbnail";
import { CardDetails } from "../card/card-details";
import { CardIcons } from "../card/card-icons";
import { CardText } from "../card/card-text";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons/skill-icons";
import { SkillIconsInvestigator } from "../skill-icons/skill-icons-investigator";
import { QuantityInput } from "../ui/quantity-input";
import { QuantityOutput } from "../ui/quantity-output";
import { DefaultTooltip } from "../ui/tooltip";
import css from "./list-card.module.css";

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
  limitOverride?: number;
  omitBorders?: boolean;
  omitThumbnail?: boolean;
  onChangeCardQuantity?: (card: Card, quantity: number, limit: number) => void;
  ownedCount?: number;
  quantity?: number;
  referenceProps?: React.ComponentProps<"div">;
  renderCardAction?: (card: Card) => React.ReactNode;
  renderCardAfter?: (card: Card) => React.ReactNode;
  renderCardBefore?: (card: Card) => React.ReactNode;
  renderCardMetaExtra?: (card: Card, quantity?: number) => React.ReactNode;
  renderCardExtra?: (card: Card, quantity?: number) => React.ReactNode;
  size?: "xs" | "sm" | "investigator";
  showCardText?: boolean;
  showInvestigatorIcons?: boolean;
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
    limitOverride,
    omitBorders,
    omitThumbnail,
    onChangeCardQuantity,
    ownedCount,
    quantity,
    referenceProps,
    renderCardAction,
    renderCardAfter,
    renderCardBefore,
    renderCardExtra,
    renderCardMetaExtra,
    showCardText,
    showInvestigatorIcons,
    size,
  } = props;

  const modalContext = useCardModalContext();

  const ignoredCount = isIgnored ?? 0;

  const colorCls = getCardColor(card);
  const Element = as as React.JSX.ElementType;

  const onQuantityChange = useCallback(
    (val: number, limit: number) => {
      onChangeCardQuantity?.(card, val, limit);
    },
    [onChangeCardQuantity, card],
  );

  const openModal = useCallback(() => {
    modalContext.setOpen({ code: card.code });
  }, [modalContext, card.code]);

  const limit = cardLimit(card, limitOverride);

  const xp = countExperience(card, 1);

  return (
    <Element
      className={cx(
        css["listcard-wrapper"],
        className,
        size && css[size],
        !omitBorders && css["borders"],
        isRemoved && quantity === 0 && css["removed"],
        isForbidden && css["forbidden"],
        isActive && css["active"],
        showCardText && css["card-text"],
        !!renderCardAfter && css["has-after"],
      )}
      data-testid={`listcard-${card.code}`}
    >
      <div className={css["listcard-action"]}>
        {!!renderCardAction && renderCardAction(card)}
        {quantity != null &&
          (onChangeCardQuantity ? (
            <QuantityInput
              limit={limit}
              onValueChange={onQuantityChange}
              tabIndex={disableKeyboard ? -1 : undefined}
              value={quantity}
            />
          ) : (
            <QuantityOutput data-testid="listcard-quantity" value={quantity} />
          ))}
        {renderCardBefore?.(card)}
      </div>

      <div className={css["listcard"]}>
        <div className={css["listcard-main"]}>
          <figure className={css["content"]} ref={figureRef}>
            {!omitThumbnail && hasImage(card) && (
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

            {size !== "xs" && card.faction_code !== "mythos" && (
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
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: safe and necessary.
                    dangerouslySetInnerHTML={{
                      __html: parseCardTextHtml(card.real_name),
                    }}
                  />
                </h4>

                {size === "xs" && !!xp && <ExperienceDots xp={xp} />}

                {ownedCount != null &&
                  card.code !== SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS &&
                  (!ownedCount ||
                    (quantity != null && ownedCount < quantity)) && (
                    <DefaultTooltip
                      tooltip={
                        quantity && (
                          <>
                            Unavailable: {quantity - ownedCount} of {quantity}
                          </>
                        )
                      }
                    >
                      <span className={css["ownership"]}>
                        <FileWarningIcon />
                      </span>
                    </DefaultTooltip>
                  )}
                {ignoredCount > 0 && (
                  <DefaultTooltip
                    tooltip={
                      <>
                        {ignoredCount}{" "}
                        {ignoredCount === 1 ? "copy does" : "copies do"} not
                        count towards the deck limit.
                      </>
                    }
                  >
                    <span
                      className={css["ignored"]}
                      data-testid="listcard-ignored"
                    >
                      <StarIcon />
                    </span>
                  </DefaultTooltip>
                )}
              </div>

              {size !== "xs" && (
                <div className={css["meta"]}>
                  {card.type_code !== "investigator" && !card.subtype_code && (
                    <MulticlassIcons
                      card={card}
                      className={css["multiclass"]}
                    />
                  )}

                  {card.parallel &&
                  card.type_code === "investigator" &&
                  size === "investigator" ? (
                    <DefaultTooltip tooltip="Uses a parallel side">
                      <i className="icon-parallel" />
                    </DefaultTooltip>
                  ) : (
                    card.parallel && <i className="icon-parallel" />
                  )}

                  {hasSkillIcons(card) && <SkillIcons card={card} />}

                  {!!card.taboo_set_id && (
                    <span className={cx(css["taboo"], "color-taboo")}>
                      {card.taboo_xp && <ExperienceDots xp={card.taboo_xp} />}
                      <i className="icon-tablet icon-layout color-taboo" />
                    </span>
                  )}

                  {!showInvestigatorIcons && card.real_subname && (
                    <h5
                      className={css["subname"]}
                      title={card.real_subname}
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: safe and necessary.
                      dangerouslySetInnerHTML={{
                        __html: parseCardTextHtml(card.real_subname),
                      }}
                    />
                  )}

                  {showInvestigatorIcons &&
                    card.type_code === "investigator" && (
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
                  {renderCardMetaExtra?.(card, quantity)}
                </div>
              )}
            </figcaption>
          </figure>
        </div>
        {renderCardExtra?.(card, quantity)}
      </div>
      {!!renderCardAfter && (
        <div className={css["listcard-after"]}>
          <div className={css["listcard-after-inner"]}>
            {renderCardAfter?.(card)}
          </div>
        </div>
      )}
      {showCardText && (
        <div className={css["listcard-text"]}>
          <CardDetails card={card} omitSlotIcon />
          {(card.type_code === "investigator" || isEnemyLike(card)) && (
            <CardIcons card={card} />
          )}
          <CardText
            text={card.real_text}
            size="tooltip"
            typeCode={card.type_code}
          />
          {card.real_back_text && (
            <CardText
              text={card.real_back_text}
              size="tooltip"
              typeCode={card.type_code}
            />
          )}
        </div>
      )}
    </Element>
  );
}
