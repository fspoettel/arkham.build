import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { CardWithRelations, ResolvedCard } from "@/store/lib/types";
import { reversed } from "@/utils/card-utils";

import css from "./card.module.css";

import { Button } from "../ui/button";
import { CardBack } from "./card-back";
import { CardContainer } from "./card-container";
import { CardFace } from "./card-face";

type Props = {
  canToggleBackside?: boolean;
  children?: React.ReactNode;
  className?: string;
  resolvedCard: ResolvedCard | CardWithRelations;
  linked?: boolean;
  size?: "compact" | "tooltip" | "full";
};

/**
 * Cards are available in three sizes:
 *  - `full`: Renders a full card with all metadata.
 *  - `compact`: Renders a card without its backside and with a smaller card image.
 *  - `tooltip`: Renders the card as a tooltip that is shown in card lists.
 */
export function Card(props: Props) {
  const {
    canToggleBackside,
    children,
    className,
    resolvedCard,
    linked,
    size = "full",
  } = props;

  const [backVisible, toggleBack] = useState(!canToggleBackside);

  const { back, card } = resolvedCard;
  const cardReversed = reversed(card);

  const frontNode = (
    <CardFace
      className={className}
      linked={linked}
      resolvedCard={resolvedCard}
      size={size}
    />
  );

  let backNode = null;

  if (card.double_sided && !back) {
    backNode = <CardBack card={card} size={size} />;
  } else if (back) {
    backNode = <CardFace resolvedCard={back} size={size} />;
  }

  const backToggle = !!backNode && canToggleBackside && (
    <Button
      className={css["card-backtoggle"]}
      onClick={() => toggleBack((p) => !p)}
    >
      {backVisible ? <ChevronUp /> : <ChevronDown />}
      Backside
    </Button>
  );

  return (
    <CardContainer data-testid={`card-${resolvedCard.card.code}`} size={size}>
      {cardReversed ? backNode : frontNode}
      {children}
      {backToggle}
      {backVisible && (cardReversed ? frontNode : backNode)}
    </CardContainer>
  );
}
