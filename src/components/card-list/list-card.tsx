import {
  FloatingPortal,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import clsx from "clsx";
import type { ElementType } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";

import type { Card } from "@/store/services/types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { CardIcon } from "../card/card-icon";
import { CardThumbnail } from "../card/card-thumbnail";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons";
import { CardTooltip } from "./card-tooltip";

type Props = {
  as?: "li" | "div";
  card: Card;
  className?: string;
  quantity?: number;
  size?: "sm";
};

export function ListCard({
  as = "div",
  card,
  className,
  quantity,
  size,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const restTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(
    () => () => {
      if (restTimeoutRef.current) clearTimeout(restTimeoutRef.current);
    },
    [],
  );

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift(), autoPlacement(), offset(2)],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
  });

  const onPointerLeave = useCallback(() => {
    clearTimeout(restTimeoutRef.current);
    setIsOpen(false);
  }, []);

  const onPointerMove = useCallback(() => {
    if (isOpen) return;

    clearTimeout(restTimeoutRef.current);

    restTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 25);
  }, [isOpen]);

  if (!card) return null;

  const colorCls = getCardColor(card);

  const referenceProps = {
    onPointerLeave,
    onPointerMove,
    onMouseLeave: onPointerLeave,
  };

  const Element = as as ElementType;

  return (
    <Element className={clsx(css["listcard"], size && css[size], className)}>
      <figure className={css["listcard-inner"]} ref={refs.setReference}>
        {quantity && (
          <strong className={css["listcard-quantity"]}>{quantity} ×</strong>
        )}

        {card.imageurl && (
          <div className={css["listcard-thumbnail"]} {...referenceProps}>
            <Link href={`/card/${card.code}`}>
              <a tabIndex={-1}>
                <CardThumbnail card={card} />
              </a>
            </Link>
          </div>
        )}

        {card.faction_code !== "mythos" && (
          <div className={clsx(css["listcard-icon"], colorCls)}>
            <CardIcon card={card} />
          </div>
        )}

        <figcaption>
          <h4
            className={clsx(css["listcard-name"], colorCls)}
            {...referenceProps}
          >
            <Link href={`/card/${card.code}`} tabIndex={-1}>
              {card.real_name}
            </Link>
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

          {isOpen && (
            <FloatingPortal>
              <div ref={refs.setFloating} style={floatingStyles}>
                <CardTooltip code={card.code} />
              </div>
            </FloatingPortal>
          )}
        </figcaption>
      </figure>
    </Element>
  );
}
