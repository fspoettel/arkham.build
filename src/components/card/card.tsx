import { ChevronDown, ChevronUp } from "lucide-react";
import { type ReactNode, useState } from "react";

import type { CardWithRelations, ResolvedCard } from "@/store/lib/types";
import { reversed } from "@/utils/card-utils";

import css from "./card.module.css";

import { Button } from "../ui/button";
import { CardBack } from "./card-back";
import { CardContainer } from "./card-container";
import { CardFront } from "./card-front";

export type Props = {
  children?: ReactNode;
  className?: string;
  resolvedCard: ResolvedCard | CardWithRelations;
  canToggleBackside?: boolean;
  linked?: boolean;
  size?: "compact" | "tooltip" | "full";
};

/**
 * Renders a card with a "simple" back-side that is tracked on the same card object.
 * Cards are available in three sizes:
 *  - `full`: Renders a full card with all metadata.
 *  - `compact`: Renders a card without its backside and with a smaller card image.
 *  - `tooltip`: Renders the card as a tooltip that is shown in card lists.
 */
export function Card({
  canToggleBackside,
  children,
  className,
  resolvedCard,
  linked,
  size = "full",
}: Props) {
  const { back, card } = resolvedCard;

  const [backToggled, toggleBack] = useState(false);

  const front = (
    <CardFront
      className={className}
      linked={linked}
      resolvedCard={resolvedCard}
      size={size}
    />
  );

  const backNode = back ? (
    <Card linked={false} resolvedCard={back} size={size} />
  ) : card.double_sided && !card.back_link_id ? (
    <CardBack card={card} size={size} />
  ) : undefined;

  const hasToggle = !!backNode && canToggleBackside;

  const backToggle = hasToggle ? (
    <Button
      className={css["card-backtoggle"]}
      onClick={() => toggleBack((p) => !p)}
    >
      {backToggled ? <ChevronUp /> : <ChevronDown />}
      Backside
    </Button>
  ) : undefined;

  const backsideVisible = !canToggleBackside || (hasToggle && backToggled);

  return reversed(card) ? (
    <CardContainer size={size}>
      {backNode}
      {children}
      {backToggle}
      {backsideVisible && front}
    </CardContainer>
  ) : (
    <CardContainer size={size}>
      {front}
      {children}
      {backToggle}
      {backsideVisible && backNode}
    </CardContainer>
  );
}
