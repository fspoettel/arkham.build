import { cx } from "@/utils/cx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import {
  getRelatedCardQuantity,
  getRelatedCards,
} from "@/store/lib/resolve-card";
import { formatRelationTitle } from "@/utils/formatting";

import css from "./deck-investigator.module.css";

import type { ResolvedDeck } from "@/store/lib/types";
import { CardModalAttachable } from "./card-modal/card-modal-attachable";
import { CardBack } from "./card/card-back";
import { CardContainer } from "./card/card-container";
import { CardFace } from "./card/card-face";
import { CardSet } from "./cardset";
import { Button } from "./ui/button";

type Props = {
  canToggleBack?: boolean;
  deck: ResolvedDeck;
  showRelated?: boolean;
  size: "tooltip" | "full";
};

export function DeckInvestigator(props: Props) {
  const { canToggleBack = true, deck, showRelated, size } = props;

  const [backToggled, toggleBack] = useState(false);

  const related = getRelatedCards(deck.cards.investigator).filter(
    ([key]) => key !== "parallel",
  );

  const hasBack =
    deck.investigatorBack.card.double_sided ||
    deck.investigatorBack.card.back_link_id;

  const children = canToggleBack ? (
    <>
      <CardFace
        data-testid="deck-investigator-front"
        resolvedCard={deck.investigatorFront}
        titleLinks="modal"
        size={size}
      />
      {hasBack && (
        <div
          className={cx(css["back-toggle"], backToggled && css["open"])}
          data-testid="deck-investigator-back-toggle"
        >
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
      )}
      {hasBack && backToggled && (
        <CardBack
          card={deck.investigatorBack.card}
          data-testid="deck-investigator-back"
          size={size}
        />
      )}
    </>
  ) : (
    <>
      <CardFace
        titleLinks="modal"
        resolvedCard={deck.investigatorFront}
        size={size}
      />
      {hasBack && <CardBack card={deck.investigatorBack.card} size={size} />}
    </>
  );

  const attachableDefinition = deck?.availableAttachments?.find(
    (config) => config.code === deck.investigatorBack.card.code,
  );

  return (
    <div className={css["deck-investigator-container"]}>
      <CardContainer
        className={cx(css["deck-investigator"], css[size])}
        data-testid="deck-investigator"
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
      {showRelated && deck && !!attachableDefinition && (
        <CardModalAttachable
          card={deck.investigatorBack.card}
          definition={attachableDefinition}
          resolvedDeck={deck}
        />
      )}
    </div>
  );
}
