import {
  FloatingPortal,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import clsx from "clsx";
import { useState } from "react";
import { Link } from "wouter";

import SvgParallel from "@/assets/icons/parallel.svg?react";
import { Card } from "@/store/services/types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { CardIcon } from "../card/card-icon";
import { CardThumbnail } from "../card/card-thumbnail";
import { ExperienceDots } from "../experience-dots";
import { MulticlassIcons } from "../icons/multiclass-icons";
import { SkillIcons } from "../skill-icons";
import { CardTooltip } from "./card-tooltip";

type Props = {
  card: Card;
};

export function ListCard({ card }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift(), autoPlacement(), offset(2)],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
  });

  const hover = useHover(context, { restMs: 25 });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  if (!card) return null;

  const colorCls = getCardColor(card);

  return (
    <figure className={clsx(css["listcard"])}>
      <div className={css["listcard-thumbnail"]}>
        <CardThumbnail card={card} />
      </div>

      {card.faction_code !== "mythos" && (
        <div className={clsx(css["listcard-icon"], colorCls)}>
          <CardIcon card={card} />
        </div>
      )}

      <figcaption>
        <h4
          className={clsx(css["listcard-name"], colorCls)}
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <Link href={`/card/${card.code}`}>{card.real_name}</Link>
        </h4>

        <div className={css["listcard-meta"]}>
          {card.parallel && <SvgParallel />}
          <MulticlassIcons className={css["listcard-multiclass"]} card={card} />
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
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <CardTooltip code={card.code} />
            </div>
          </FloatingPortal>
        )}
      </figcaption>
    </figure>
  );
}
