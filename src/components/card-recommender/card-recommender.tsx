import { useStore } from "@/store";
import {
  type Recommendation,
  computeRecommendationForCard,
  getNumberOfDecksForInvestigator,
} from "@/store/lib/card-recommendations";
import { type ListState, selectListCards } from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import { cx } from "@/utils/cx";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { Rows3Icon } from "lucide-react";
import { Link } from "wouter";
import { CardList } from "../card-list/card-list";
import type { CardListProps } from "../card-list/types";
import { Footer } from "../footer";
import { Button } from "../ui/button";
import css from "./card-recommender.module.css";
import { IncludeSideDeckToggle } from "./include-side-deck-toggle";
import { RecommendationBar } from "./recommendation-bar";
import { RecommenderRelativityToggle } from "./recommender-relativity-toggle";

export function CardRecommender(props: CardListProps) {
  const {
    itemSize,
    onChangeCardQuantity,
    quantities,
    renderCardAction,
    renderCardExtra,
    renderCardMetaExtra,
  } = props;

  const ctx = useResolvedDeck();
  const resolvedDeck = ctx.resolvedDeck;
  const metadata = useStore((state) => state.metadata);
  const data = useStore((state) =>
    selectListCards(state, ctx.resolvedDeck, "slots"),
  );
  const deckInclusions = useStore((state) => state.lookupTables.deckInclusions);
  const sideDeckInclusions = useStore(
    (state) => state.lookupTables.sideDeckInclusions,
  );
  const countsByInvestigator = useStore(
    (state) => state.lookupTables.countsByInvestigator,
  );
  const sideCountsByInvestigator = useStore(
    (state) => state.lookupTables.sideCountsByInvestigator,
  );
  const includeSideDeck = useStore(
    (state) => state.recommender.includeSideDeck,
  );
  const isRelative = useStore((state) => state.recommender.isRelative);

  let content = null;
  if (data && metadata && resolvedDeck) {
    const deckCount = getNumberOfDecksForInvestigator(
      metadata.decklists,
      resolvedDeck.investigator_code,
    );
    const recommendations = data.cards.reduce<Record<string, Recommendation>>(
      (acc, card) => {
        acc[card.code] = computeRecommendationForCard(
          card,
          resolvedDeck,
          metadata.decklists,
          deckInclusions,
          sideDeckInclusions,
          countsByInvestigator,
          sideCountsByInvestigator,
          includeSideDeck,
          isRelative,
        );
        return acc;
      },
      {},
    );

    const sortedCards = data.cards.slice();
    sortedCards.sort((a, b) => {
      return (
        recommendations[b.code].ordering - recommendations[a.code].ordering
      );
    });

    const newData: ListState = {
      cards: sortedCards,
      totalCardCount: sortedCards.length,
      groups: [],
      groupCounts: [],
      key: "recommendations",
    };

    const renderRecBar = (card: Card) => (
      <RecommendationBar
        card={card}
        deckCount={deckCount}
        investigator={resolvedDeck.investigator_name}
        recommendations={recommendations}
      />
    );

    content = (
      <div className={css["container"]}>
        <div className={css["toolbar"]}>
          <span>{deckCount} decks analyzed</span>
          <div>
            <IncludeSideDeckToggle />
            <RecommenderRelativityToggle
              investigator={resolvedDeck.investigator_name}
            />
          </div>
        </div>
        <CardList
          data={newData}
          metadata={metadata}
          resolvedDeck={ctx.resolvedDeck}
          viewMode="compact"
          grouped={false}
          itemSize={itemSize}
          onChangeCardQuantity={onChangeCardQuantity}
          quantities={quantities}
          renderCardAction={renderCardAction}
          renderCardExtra={renderCardExtra}
          renderCardAfter={renderRecBar}
          renderCardMetaExtra={renderCardMetaExtra}
        />
      </div>
    );
  }

  return (
    <article className={cx(css["card-recommender"])}>
      <header className={css["recommender-header"]}>
        <h3 className={css["recommender-title"]}>Card Recommendations</h3>
        <Link to="/" asChild>
          <Button as="a">
            <Rows3Icon />
            Back to card list
          </Button>
        </Link>
      </header>
      {
        content
        //TODO Sy: fix css so the footer actually shows
      }
      <Footer />
    </article>
  );
}
