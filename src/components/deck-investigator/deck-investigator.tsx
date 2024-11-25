import { useStore } from "@/store";
import {
  getRelatedCardQuantity,
  getRelatedCards,
} from "@/store/lib/resolve-card";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectLimitedSlotOccupation } from "@/store/selectors/decks";
import { cx } from "@/utils/cx";
import { formatRelationTitle } from "@/utils/formatting";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { CardBack } from "../card/card-back";
import { CardContainer } from "../card/card-container";
import { CardFace } from "../card/card-face";
import { CardSet } from "../cardset";
import { AttachableCards } from "../deck-tools/attachable-cards";
import { LimitedCardGroup } from "../limited-card-group";
import { ListCard } from "../list-card/list-card";
import { Button } from "../ui/button";
import css from "./deck-investigator.module.css";

type Props = {
  canToggleBack?: boolean;
  deck: ResolvedDeck;
  readonly?: boolean;
  showRelated?: boolean;
  size: "tooltip" | "full";
  titleLinks?: "dialog" | "modal" | "card";
};

export function DeckInvestigator(props: Props) {
  const {
    canToggleBack = true,
    deck,
    readonly,
    showRelated,
    size,
    titleLinks,
  } = props;

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
        titleLinks={titleLinks ?? "modal"}
        size={size}
      />
      {hasBack && (
        <div
          className={cx(css["back-toggle"], backToggled && css["open"])}
          data-testid="deck-investigator-back-toggle"
        >
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

  const limitedSlots = useStore((state) =>
    selectLimitedSlotOccupation(state, deck),
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
      {showRelated && deck && !!attachableDefinition && (
        <AttachableCards
          card={deck.investigatorBack.card}
          definition={attachableDefinition}
          readonly={readonly}
          resolvedDeck={deck}
        />
      )}
      {showRelated &&
        limitedSlots?.map((entry) => (
          <LimitedCardGroup
            key={entry.index}
            count={{
              limit: entry.option.limit ?? 0,
              total: entry.entries.reduce(
                (acc, { quantity }) => acc + quantity,
                0,
              ),
            }}
            entries={entry.entries}
            renderCard={({ card, quantity }) => (
              <ListCard card={card} key={card.code} quantity={quantity} />
            )}
            title={entry.option.name ?? "Limited slots"}
          />
        ))}
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
    </div>
  );
}
