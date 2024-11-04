import { assert } from "@/utils/assert";
import { FACTION_ORDER } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";
import { and, or } from "@/utils/fp";
import uFuzzy from "@leeoniya/ufuzzy";
import { createSelector } from "reselect";
import type { FactionName, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";
import type {
  DeckFiltersKey,
  DeckPropertyName,
  DeckValidity,
  RangeMinMax,
  SortOrder,
} from "../slices/deck-collection-filters.types";
import type { MultiselectFilter } from "../slices/lists.types";
import { selectLocalDecks } from "./decks";

// Arbitrarily chosen for now
const MATCHING_MAX_TOKEN_DISTANCE_DECKS = 4;

export const selectDeckFilters = (state: StoreState) =>
  state.deckFilters.filters;

export const selectDeckFilterValue = createSelector(
  selectDeckFilters,
  (_, filter: DeckFiltersKey) => filter,
  (filters, filter) => filters[filter],
);

// Search
export const selectDeckSearchTerm = (state: StoreState) =>
  state.deckFilters.filters.search;

export const selectSearchableTextInDecks = createSelector(
  selectLocalDecks,
  (decks) => {
    return decks.map(
      (deck) => `${deck.name}|${deck.cards.investigator.card.real_name}`,
    );
  },
);

// Faction
export const selectDeckFactionFilter = (state: StoreState) =>
  state.deckFilters.filters.faction;

const filterDeckByFaction = (faction: string) => {
  return (deck: ResolvedDeck) => {
    return deck.cards.investigator.card.faction_code === faction;
  };
};

const makeDeckFactionFilter = (values: MultiselectFilter) => {
  return or(values.map((value) => filterDeckByFaction(value)));
};

// Tag
const filterDeckByTag = (tag: string) => {
  return (deck: ResolvedDeck) => {
    return deck.tags.includes(tag);
  };
};

const makeDeckTagsFilter = (values: MultiselectFilter) => {
  return or(values.map((value) => filterDeckByTag(value)));
};

export const selectTagsChanges = createSelector(
  selectDeckFilters,
  (filters) => {
    const tagsFilters = filters.tags;
    if (!tagsFilters.length) return "";
    return tagsFilters.map(capitalize).join(" or ");
  },
);

// Properties
export const selectDeckPropertiesFilter = (state: StoreState) =>
  state.deckFilters.filters.properties;

export const selectPropertiesChanges = createSelector(
  selectDeckPropertiesFilter,
  (properties) => {
    return Object.keys(properties)
      .filter((prop) => properties[prop as DeckPropertyName])
      .map(capitalize)
      .join(" and ");
  },
);

const makeDeckPropertiesFilter = (
  properties: Record<DeckPropertyName, boolean>,
) => {
  const filters = [];
  for (const property of Object.keys(properties)) {
    if (properties[property as DeckPropertyName]) {
      switch (property) {
        case "parallel":
          filters.push((deck: ResolvedDeck) =>
            Boolean(
              deck.investigatorFront.card.parallel ||
                deck.investigatorBack.card.parallel,
            ),
          );
      }
    }
  }
  return and(filters);
};

// Validity
const makeDeckValidityFilter = (value: Omit<DeckValidity, "all">) => {
  switch (value) {
    case "valid":
      return (deck: ResolvedDeck) => deck.problem === null;
    case "invalid":
      return (deck: ResolvedDeck) => Boolean(deck.problem);
    default:
      return (_: ResolvedDeck) => true;
  }
};

// Exp Cost
export const selectDecksMinMaxExpCost = createSelector(
  selectLocalDecks,
  (decks) => {
    const minmax: RangeMinMax = decks.reduce<[number, number]>(
      (acc, val) => {
        const { xpRequired } = val.stats;
        acc[0] = Math.min(acc[0], xpRequired);
        acc[1] = Math.max(acc[1], xpRequired);
        return acc;
      },
      [Number.POSITIVE_INFINITY, 0],
    );
    return minmax;
  },
);

export const selectExpCostChanges = createSelector(
  selectDeckFilters,
  (filters) => {
    const expMinMax = filters.expCost;
    return expMinMax ? `${expMinMax[0]}-${expMinMax[1]} experience` : "";
  },
);

export const makeDeckExpCostFilter = (minmax: [number, number]) => {
  return (deck: ResolvedDeck) => {
    return (
      deck.stats.xpRequired >= minmax[0] && deck.stats.xpRequired <= minmax[1]
    );
  };
};

const selectFilteringFunc = createSelector(selectDeckFilters, (filters) => {
  const filterFuncs = [];
  for (const filter of Object.keys(filters) as DeckFiltersKey[]) {
    switch (filter) {
      case "faction": {
        const currentFilter = filters[filter];
        if (currentFilter.length) {
          filterFuncs.push(makeDeckFactionFilter(currentFilter));
        }
        break;
      }
      case "tags": {
        const currentFilter = filters[filter];
        if (currentFilter.length) {
          filterFuncs.push(makeDeckTagsFilter(currentFilter));
        }
        break;
      }
      case "properties": {
        const currentFilter = filters[filter];
        filterFuncs.push(makeDeckPropertiesFilter(currentFilter));
        break;
      }
      case "validity": {
        const currentFilter = filters[filter];
        if (currentFilter !== "all") {
          filterFuncs.push(makeDeckValidityFilter(currentFilter));
        }
        break;
      }
      case "expCost": {
        const currentFilter = filters[filter];
        if (currentFilter) {
          filterFuncs.push(makeDeckExpCostFilter(currentFilter));
          break;
        }
      }
    }
  }

  return and(filterFuncs);
});

export const selectFactionsInLocalDecks = createSelector(
  selectLocalDecks,
  (state: StoreState) => state.metadata.factions,
  (decks, factionMeta) => {
    if (!decks) return [];

    const factionsSet = new Set<string>();

    for (const deck of decks) {
      factionsSet.add(deck.cards.investigator.card.faction_code);
    }

    const factions = Array.from(factionsSet).map((code) => factionMeta[code]);

    return factions.sort(
      (a, b) =>
        FACTION_ORDER.indexOf(a.code as FactionName) -
        FACTION_ORDER.indexOf(b.code as FactionName),
    );
  },
);

export const selectTagsInLocalDecks = createSelector(
  selectLocalDecks,
  (decks) => {
    let tags: string[] = [];

    for (const deck of decks) {
      if (deck.tags) {
        const tagArray = deck.tags.split(" ");
        tags = tags.concat(tagArray);
      }
    }

    const uniqueTags = [...new Set(tags)].map((tag) => {
      return {
        code: tag,
      };
    });
    return uniqueTags;
  },
);

export const selectDecksFiltered = createSelector(
  selectLocalDecks,
  selectDeckSearchTerm,
  selectSearchableTextInDecks,
  selectFilteringFunc,
  (decks, searchTerm, searchableText, filterFunc) => {
    let decksToFilter: ResolvedDeck[];

    if (searchTerm) {
      const finder = new uFuzzy({
        intraMode: 0,
        interIns: MATCHING_MAX_TOKEN_DISTANCE_DECKS,
      });

      const results = finder.search(searchableText, searchTerm);

      decksToFilter = [];

      if (results[0]) {
        for (const result of results[0]) {
          assert(decks[result], "Searching outside of bounds");
          decksToFilter.push(decks[result]);
        }
      }
    } else {
      decksToFilter = decks;
    }

    const filteredDecks = decksToFilter.filter(filterFunc);
    return {
      decks: filteredDecks ?? decks,
      total: decks.length,
    };
  },
);

export const selectDecksSorting = (state: StoreState) => state.deckFilters.sort;

function genericSort(a: string | number, b: string | number, order: SortOrder) {
  const mod = order === "desc" ? -1 : 1;
  return a < b ? -1 * mod : a > b ? 1 * mod : 0;
}

function makeAlphabeticalSort(order: SortOrder) {
  return (a: ResolvedDeck, b: ResolvedDeck) =>
    genericSort(a.name, b.name, order);
}

function makeDeckCreatedSort(order: SortOrder) {
  return (a: ResolvedDeck, b: ResolvedDeck) =>
    genericSort(a.date_creation, b.date_creation, order);
}

function makeDeckUpdatedSort(order: SortOrder) {
  return (a: ResolvedDeck, b: ResolvedDeck) =>
    genericSort(a.date_update, b.date_update, order);
}

function makeXPSort(order: SortOrder) {
  return (a: ResolvedDeck, b: ResolvedDeck) =>
    genericSort(a.stats.xpRequired, b.stats.xpRequired, order);
}

export const selectDecksSortingFunc = createSelector(
  selectDecksSorting,
  (sortingInfo) => {
    switch (sortingInfo.criteria) {
      case "alphabetical": {
        return makeAlphabeticalSort(sortingInfo.order);
      }
      case "date_updated": {
        return makeDeckUpdatedSort(sortingInfo.order);
      }
      case "xp": {
        return makeXPSort(sortingInfo.order);
      }
      case "date_created": {
        return makeDeckCreatedSort(sortingInfo.order);
      }
      default: {
        return makeDeckUpdatedSort(sortingInfo.order);
      }
    }
  },
);

export const selectDecksDisplayList = createSelector(
  selectDecksFiltered,
  selectDecksSortingFunc,
  (decks, sorting) => {
    return {
      decks: decks.decks.sort(sorting),
      total: decks.total,
    };
  },
);
