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
import { Card as CardSchema } from "@/store/graphql/types";
import { getCardColor, hasSkillIcons } from "@/utils/card-utils";

import css from "./list-card.module.css";

import { CardIcon } from "../card/card-icon";
import { CardThumbnail } from "../card/card-thumbnail";
import { MulticlassIcons } from "../ui/icons/multiclass-icons";
import { SkillIcons } from "../ui/skill-icons";
import { CardTooltip } from "./card-tooltip";

type Props = {
  card: CardSchema;
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
