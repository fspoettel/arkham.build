import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { DisplayDeck } from "@/store/lib/deck-grouping";
import {
  getRelatedCardQuantity,
  getRelatedCards,
} from "@/store/lib/resolve-card";
import { formatRelationTitle } from "@/utils/formatting";

import css from "./deck-investigator.module.css";

import { CardBack } from "./card/card-back";
import { CardContainer } from "./card/card-container";
import { CardFront } from "./card/card-front";
import { CardSet } from "./cardset";
import { Button } from "./ui/button";

type Props = {
  canToggleBack?: boolean;
  forceShowHeader?: boolean;
  deck: DisplayDeck;
  showRelated?: boolean;
  size: "tooltip" | "full";
};

export function DeckInvestigator({
  canToggleBack = true,
  forceShowHeader,
  deck,
  showRelated,
  size,
}: Props) {
  const [backToggled, toggleBack] = useState(false);

  const related = getRelatedCards(deck.cards.investigator).filter(
    ([key]) => key !== "parallel",
  );

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
    <>
      <CardContainer
        className={clsx(css["deck-investigator"], css[size])}
        size={size}
      >
        {children}
      </CardContainer>
      {showRelated && !!related.length && (
        <div className={css["deck-investigator-related"]}>
          {related.map(([key, value]) => {
            const cards = Array.isArray(value) ? value : [value];
            return (
              <CardSet
                key={key}
                set={{
                  title: formatRelationTitle(key),
                  cards,
                  id: key,
                  selected: false,
                  quantities: getRelatedCardQuantity(key, cards),
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
