import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { DisplayDeck } from "@/store/lib/deck-grouping";

import css from "./deck-investigator.module.css";

import { CardBack } from "./card/card-back";
import { CardContainer } from "./card/card-container";
import { CardFront } from "./card/card-front";
import { Button } from "./ui/button";

type Props = {
  canToggleBack?: boolean;
  forceShowHeader?: boolean;
  deck: DisplayDeck;
  size: "tooltip" | "full";
};

export function DeckInvestigator({
  canToggleBack = true,
  forceShowHeader,
  deck,
  size,
}: Props) {
  const [backToggled, toggleBack] = useState(false);

  const children = canToggleBack ? (
    <>
      <CardFront resolvedCard={deck.investigatorFront} size={size} />
      <div className={clsx(css["back-toggle"], backToggled && css["open"])}>
        <Button onClick={() => toggleBack((p) => !p)}>
          {backToggled ? <ChevronUp /> : <ChevronDown />}
          Backside{" "}
          {deck.investigatorBack.card.parallel && (
            <>
              (<span className="icon-parallel" />)
            </>
          )}
        </Button>
      </div>
      {backToggled && (
        <CardBack card={deck.investigatorBack.card} size={size} />
      )}
    </>
  ) : (
    <>
      <CardFront linked resolvedCard={deck.investigatorFront} size={size} />
      <CardBack
        card={deck.investigatorBack.card}
        forceShowHeader={forceShowHeader}
        size={size}
      />
    </>
  );

  return (
    <CardContainer
      className={clsx(css["deck-investigator"], css[size])}
      size={size}
    >
      {children}
    </CardContainer>
  );
}
