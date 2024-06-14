import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";

import type { DisplayDeck } from "@/store/lib/deck-grouping";

import css from "./deck-investigator.module.css";

import { CardBack } from "../card/card-back";
import { CardContainer } from "../card/card-container";
import { CardFront } from "../card/card-front";
import { Button } from "../ui/button";

type Props = {
  canToggleBack?: boolean;
  forceShowHeader?: boolean;
  deck: DisplayDeck;
};

export function DeckInvestigator({
  canToggleBack = true,
  forceShowHeader,
  deck,
}: Props) {
  const [backToggled, toggleBack] = useState(false);

  const children = canToggleBack ? (
    <>
      <CardFront resolvedCard={deck.investigatorFront} size="tooltip" linked />
      <div className={clsx(css["back-toggle"], backToggled && css["open"])}>
        <Button onClick={() => toggleBack((p) => !p)}>
          {backToggled ? <ChevronUpIcon /> : <ChevronDownIcon />}
          Backside{" "}
          {deck.investigatorBack.card.parallel && (
            <>
              (<span className="icon-parallel" />)
            </>
          )}
        </Button>
      </div>
      {backToggled && (
        <CardBack card={deck.investigatorBack.card} size="tooltip" />
      )}
    </>
  ) : (
    <>
      <CardFront resolvedCard={deck.investigatorFront} size="tooltip" linked />
      <CardBack
        forceShowHeader={forceShowHeader}
        card={deck.investigatorBack.card}
        size="tooltip"
      />
    </>
  );

  return <CardContainer size="tooltip">{children}</CardContainer>;
}
