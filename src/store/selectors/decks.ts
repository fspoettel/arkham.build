import { resolveDeck } from "@/store/lib/resolve-deck";
import { decodeExileSlots } from "@/utils/card-utils";
import { time, timeEnd } from "@/utils/time";
import { createSelector } from "reselect";
import { applyCardChanges } from "../lib/card-edits";
import { applyDeckEdits } from "../lib/deck-edits";
import { type UpgradeStats, getUpgradeStats } from "../lib/deck-upgrades";
import { type ForbiddenCardError, validateDeck } from "../lib/deck-validation";
import { sortAlphabetical, sortByName } from "../lib/sorting";
import type { Customization, Customizations, ResolvedDeck } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import type { Id } from "../slices/data.types";
import type { Slot } from "../slices/deck-edits.types";

export const selectResolvedDeckById = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState, deckId?: Id) =>
    deckId ? state.data.decks[deckId] : undefined,
  (state: StoreState, deckId?: Id, applyEdits?: boolean) =>
    deckId && applyEdits ? state.deckEdits?.[deckId] : undefined,
  (metadata, lookupTables, deck, edits) => {
    if (!deck) return undefined;

    time("select_resolved_deck");

    const resolvedDeck = resolveDeck(
      metadata,
      lookupTables,
      edits ? applyDeckEdits(deck, edits, metadata) : deck,
    );

    timeEnd("select_resolved_deck");
    return resolvedDeck;
  },
);

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.data,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (data, metadata, lookupTables) => {
    time("select_local_decks");

    const { history } = data;

    const resolvedDecks = Object.keys(history).reduce<ResolvedDeck[]>(
      (acc, id) => {
        const deck = data.decks[id];

        try {
          if (deck) {
            const resolved = resolveDeck(metadata, lookupTables, deck);
            acc.push(resolved);
          } else {
            console.warn(`Could not find deck ${id} in local storage.`);
          }
        } catch (err) {
          console.error(`Error resolving deck ${id}: ${err}`);
          return acc;
        }

        return acc;
      },
      [],
    );

    resolvedDecks.sort((a, b) =>
      sortAlphabetical(b.date_update, a.date_update),
    );

    timeEnd("select_local_decks");
    return resolvedDecks;
  },
);

export const selectDeckValid = createSelector(
  (_: StoreState, deck: ResolvedDeck | undefined) => deck,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (deck, lookupTables, metadata) => {
    return deck
      ? validateDeck(deck, { lookupTables, metadata } as StoreState)
      : { valid: false, errors: [] };
  },
);

export const selectForbiddenCards = createSelector(
  selectDeckValid,
  (deckValidation) => {
    const forbidden = deckValidation.errors.find((x) => x.type === "FORBIDDEN");
    if (!forbidden) return [];
    return (forbidden as ForbiddenCardError).details;
  },
);

export function selectCurrentCardQuantity(
  state: StoreState,
  deckId: Id,
  code: string,
  key: Slot,
) {
  const deck = selectResolvedDeckById(state, deckId, true);
  return deck?.[key]?.[code] ?? 0;
}

export function selectCurrentInvestigatorFactionCode(
  state: StoreState,
  deckId: Id,
) {
  const deck = selectResolvedDeckById(state, deckId, true);
  return deck?.cards.investigator.card.faction_code;
}

export type SlotUpgrade = {
  diff: number;
  card: Card;
};

export type CustomizationUpgrade = {
  diff: Customization[];
  card: Card;
  xpMax: number;
};

type HistoryEntry = UpgradeStats & {
  differences: {
    slots: SlotUpgrade[];
    extraSlots: SlotUpgrade[];
    exileSlots: SlotUpgrade[];
    customizations: CustomizationUpgrade[];
  };
  id: Id;
};

export type History = HistoryEntry[];

type Changes = {
  exileSlots: Record<string, number>;
  customizations?: Customizations;
  stats: UpgradeStats;
  tabooSetId: number | undefined | null;
  id: Id;
};

function getChanges(prev: ResolvedDeck, next: ResolvedDeck): Changes {
  return {
    id: next.id,
    customizations: next.customizations,
    stats: getUpgradeStats(prev, next),
    tabooSetId: next.taboo_id,
    exileSlots: decodeExileSlots(next.exile_string),
  };
}

function getHistoryEntry(
  changes: Changes,
  metadata: StoreState["metadata"],
): HistoryEntry {
  const { customizations, exileSlots, id, stats, tabooSetId } = changes;

  const differences = {
    slots: Object.entries(stats.changes.slots)
      .map(([code, diff]) => ({
        diff,
        card: applyCardChanges(
          metadata.cards[code],
          metadata,
          tabooSetId,
          customizations,
        ),
      }))
      .sort(sortDiff),
    extraSlots: Object.entries(stats.changes.extraSlots)
      .map(([code, diff]) => ({
        diff,
        card: applyCardChanges(
          metadata.cards[code],
          metadata,
          tabooSetId,
          customizations,
        ),
      }))
      .sort(sortDiff),
    exileSlots: Object.entries(exileSlots)
      .map(([code, diff]) => ({
        diff: diff * -1,
        card: applyCardChanges(
          metadata.cards[code],
          metadata,
          tabooSetId,
          customizations,
        ),
      }))
      .sort(sortDiff),
    customizations: Object.entries(stats.changes.customizations)
      .filter(([, diff]) => diff.some((c) => c.xp_spent > 0))
      .map(([code, diff]) => ({
        diff,
        xpMax: diff.reduce(
          (acc, curr) =>
            Math.max(
              acc,
              curr.xp_spent
                ? metadata.cards[code]?.customization_options?.[curr.index]
                    ?.xp || 0
                : 0,
              0,
            ),
          0,
        ),
        card: applyCardChanges(
          metadata.cards[code],
          metadata,
          tabooSetId,
          customizations,
        ),
      }))
      .sort((a, b) => sortByName(a.card, b.card)),
  };

  return {
    id,
    ...stats,
    differences,
  };
}

export const selectDeckHistory = createSelector(
  (_: StoreState, id: Id) => id,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.data,
  (id, metadata, lookupTables, data) => {
    const deck = data.decks[id];

    const history = data.history[id] ? [...data.history[id]] : [];

    if (!deck || !history.length) return [];

    time("deck_history");

    const changes: Changes[] = [];

    history.unshift(id);
    history.reverse();

    for (let i = 0; i < history.length - 1; i++) {
      const prev = history[i];
      const next = history[i + 1];

      if (!data.decks[prev] || !data.decks[next]) break;

      changes.unshift(
        getChanges(
          resolveDeck(metadata, lookupTables, data.decks[prev]),
          resolveDeck(metadata, lookupTables, data.decks[next]),
        ),
      );
    }

    const diffs: History = changes.map((change) =>
      getHistoryEntry(change, metadata),
    );
    timeEnd("deck_history");

    return diffs;
  },
);

function sortDiff(a: SlotUpgrade, b: SlotUpgrade) {
  const aPos = a.diff > 0;
  const bPos = b.diff > 0;
  if (aPos && !bPos) return -1;
  if (!aPos && bPos) return 1;
  return sortByName(a.card, b.card);
}

export const selectLatestUpgrade = createSelector(
  (state: StoreState) => state.metadata,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (state: StoreState, deck: ResolvedDeck) => {
    const prevId = deck?.previous_deck;
    return prevId ? selectResolvedDeckById(state, prevId) : undefined;
  },
  (metadata, next, prev) => {
    if (!prev || !next) return undefined;
    time("latest_upgrade");
    const changes = getChanges(prev, next);
    const differences = getHistoryEntry(changes, metadata);

    timeEnd("latest_upgrade");
    return differences;
  },
);
