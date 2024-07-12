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

export function DeckInvestigator(props: Props) {
  const [backToggled, toggleBack] = useState(false);

  const related = getRelatedCards(props.deck.cards.investigator).filter(
    ([key]) => key !== "parallel",
  );

  const children = props.canToggleBack ? (
    <>
      <CardFront
        data-testid="deck-investigator-front"
        resolvedCard={props.deck.investigatorFront}
        size={props.size}
      />
      <div
        className={clsx(css["back-toggle"], backToggled && css["open"])}
        data-testid="deck-investigator-back-toggle"
      >
        <Button onClick={() => toggleBack((p) => !p)}>
          {backToggled ? <ChevronUp /> : <ChevronDown />}
          Backside{" "}
          {props.deck.investigatorBack.card.parallel && (
            <>
              (<span className="icon-parallel" />)
            </>
          )}
        </Button>
      </div>
      {backToggled && (
        <CardBack
          card={props.deck.investigatorBack.card}
          data-testid="deck-investigator-back"
          size={props.size}
        />
      )}
    </>
  ) : (
    <>
      <CardFront
        linked
        resolvedCard={props.deck.investigatorFront}
        size={props.size}
      />
      <CardBack
        card={props.deck.investigatorBack.card}
        forceShowHeader={props.forceShowHeader}
        size={props.size}
      />
    </>
  );

  return (
    <>
      <CardContainer
        className={clsx(css["deck-investigator"], css[props.size])}
        data-testid="deck-investigator"
        size={props.size}
      >
        {children}
      </CardContainer>
      {props.showRelated && !!related.length && (
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
