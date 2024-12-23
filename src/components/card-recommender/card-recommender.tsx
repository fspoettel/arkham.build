import { ErrorDisplay } from "@/pages/errors/error-display";
import { useStore } from "@/store";
import { type ListState, selectListCards } from "@/store/selectors/lists";
import { getRecommendations } from "@/store/services/queries";
import type { Card, Recommendation } from "@/store/services/queries.types";
import { deckTickToString } from "@/store/slices/recommender";
import { cx } from "@/utils/cx";
import { useQuery } from "@/utils/use-query";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { Rows3Icon } from "lucide-react";
import { type MutableRefObject, useCallback, useRef } from "react";
import { Link } from "wouter";
import { CardList } from "../card-list/card-list";
import { CardSearch } from "../card-list/card-search";
import type { CardListProps } from "../card-list/types";
import { Footer } from "../footer";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import css from "./card-recommender.module.css";
import { DeckDateRangeFilter } from "./deck-date-range-filter";
import { IncludeSideDeckToggle } from "./include-side-deck-toggle";
import { RecommendationBar } from "./recommendation-bar";
import { RecommenderRelativityToggle } from "./recommender-relativity-toggle";

// Like useMemo, but has one argument that is allowed to be a subset of previous renders
function useMemoSubset<T, S extends unknown[]>(
  fn: () => T,
  subsetDep: S | undefined,
  deps: unknown[],
): T {
  type State = {
    value: T | null;
    subset: S | undefined;
    deps: unknown[];
  };
  const state: MutableRefObject<State | null> = useRef(null);

  const needsRecompute = () => {
    if (state.current === null) {
      return true;
    }
    if (!subsetDep?.every((val) => state.current?.subset?.includes(val))) {
      return true;
    }

    if (!state.current.deps.every((val, idx) => val === deps[idx])) {
      return true;
    }
  };

  if (needsRecompute()) {
    state.current = {
      value: fn(),
      subset: subsetDep,
      deps: deps,
    };
  }

  return state.current?.value as T;
}

export function CardRecommender(props: CardListProps) {
  const {
    itemSize,
    onChangeCardQuantity,
    quantities,
    renderCardAction,
    renderCardExtra,
    renderCardMetaExtra,
    slotLeft,
    slotRight,
  } = props;

  const ctx = useResolvedDeck();
  const resolvedDeck = ctx.resolvedDeck;
  const metadata = useStore((state) => state.metadata);
  const listState = useStore((state) =>
    selectListCards(state, ctx.resolvedDeck, "slots"),
  );
  const includeSideDeck = useStore(
    (state) => state.recommender.includeSideDeck,
  );
  const isRelative = useStore((state) => state.recommender.isRelative);
  const dateRange = useStore((state) => state.recommender.deckFilter);

  const coreCards = useStore((state) => state.recommender.coreCards);
  const recommendationQuery = useMemoSubset(
    () => {
      if (!resolvedDeck?.id || !listState?.cards) {
        return () =>
          Promise.resolve({ recommendations: [], decks_analyzed: 0 });
      }
      const dateRangeStrings = dateRange.map(deckTickToString) as [
        string,
        string,
      ];
      // We don't want to recommend signatures, story cards, or weaknesses
      const toRecommend = listState.cards
        .filter((card) => card.xp != null)
        .map((card) => card.code);
      const canonicalizedInvestigatorCode = `${resolvedDeck?.metaParsed.alternate_back ?? resolvedDeck?.investigator_code}-${resolvedDeck?.metaParsed.alternate_front ?? resolvedDeck?.investigator_code}`;
      return () =>
        getRecommendations(
          canonicalizedInvestigatorCode,
          includeSideDeck,
          isRelative,
          coreCards[resolvedDeck.id] || [],
          toRecommend,
          dateRangeStrings,
        );
    },
    listState?.cards, //Allows the new version of listState.cards to be a subset of the old one
    [
      resolvedDeck?.id,
      resolvedDeck?.investigator_code,
      resolvedDeck?.metaParsed.alternate_back,
      resolvedDeck?.metaParsed.alternate_front,
      includeSideDeck,
      isRelative,
      dateRange,
      coreCards,
    ],
  );

  const { data, state } = useQuery(recommendationQuery);

  const onKeyboardNavigate = useCallback((evt: React.KeyboardEvent) => {
    if (evt.key === "Enter" || evt.key === "Escape") {
      evt.preventDefault();

      if (evt.key === "Escape" && evt.target instanceof HTMLElement) {
        evt.target.blur();
      }
    }
  }, []);

  if (resolvedDeck && metadata && listState) {
    if (state === "loading" || state === "initial") {
      return <Loader show message="Computing recommendations..." />;
    }

    if (state === "error") {
      return (
        <ErrorDisplay
          message="Could not retrieve recommendations."
          status={500}
        />
      );
    }

    const { recommendations, decks_analyzed } = data;

    const indexedRecommendations = recommendations.reduce<
      Record<string, Recommendation>
    >((acc, rec) => {
      acc[rec.card_code] = rec;
      return acc;
    }, {});

    const sortedCards = listState.cards
      .filter((card) => {
        return indexedRecommendations[card.code] !== undefined;
      })
      .slice();
    sortedCards.sort((a, b) => {
      return (
        indexedRecommendations[b.code].ordering -
        indexedRecommendations[a.code].ordering
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
        deckCount={decks_analyzed}
        investigator={resolvedDeck.investigator_name}
        recommendations={indexedRecommendations}
      />
    );

    return (
      <article className={cx(css["card-recommender"])}>
        <div className={cx(css["container"])}>
          <div className={cx(css["toolbar"])}>
            <CardSearch
              onInputKeyDown={onKeyboardNavigate}
              slotLeft={slotLeft}
              slotRight={slotRight}
            />
            <DeckDateRangeFilter />
            <div className={cx(css["toggle-container"])}>
              <IncludeSideDeckToggle />
              <span className={css["toggle-decks-count"]}>
                <i className="icon-deck" />
                {decks_analyzed} decks
              </span>
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
        <Footer />
      </article>
    );
  }

  return (
    <article className={cx(css["card-recommender"])}>
      <header className={cx(css["recommender-header"])}>
        <h3 className={cx(css["recommender-title"])}>Card Recommender</h3>
        <Link to="/" asChild>
          <Button as="a">
            <Rows3Icon />
            Back to card list
          </Button>
        </Link>
      </header>
      <Footer />
    </article>
  );
}
