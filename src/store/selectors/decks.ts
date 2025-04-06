import { resolveDeck } from "@/store/lib/resolve-deck";
import { time, timeEnd } from "@/utils/time";
import { createSelector } from "reselect";
import { applyCardChanges } from "../lib/card-edits";
import {
  type ChangeRecord,
  applyDeckEdits,
  getChangeRecord,
} from "../lib/deck-edits";
import { groupDeckCards } from "../lib/deck-grouping";
import type { ChangeStats, UpgradeStats } from "../lib/deck-upgrades";
import { type ForbiddenCardError, validateDeck } from "../lib/deck-validation";
import { limitedSlotOccupation } from "../lib/limited-slots";
import { makeSortFunction, sortAlphabeticalLatin } from "../lib/sorting";
import type { Customization, ResolvedDeck } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import type { Deck, Id } from "../slices/data.types";
import { selectLocaleSortingCollator } from "./shared";

export const selectResolvedDeckById = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.sharing,
  selectLocaleSortingCollator,
  (state: StoreState, deckId?: Id) =>
    deckId ? state.data.decks[deckId] : undefined,
  (state: StoreState, deckId?: Id, applyEdits?: boolean) =>
    deckId && applyEdits ? state.deckEdits?.[deckId] : undefined,
  (metadata, lookupTables, sharing, collator, deck, edits) => {
    if (!deck) return undefined;

    time("select_resolved_deck");

    const resolvedDeck = resolveDeck(
      { metadata, lookupTables, sharing },
      collator,
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
  (state: StoreState) => state.sharing,
  selectLocaleSortingCollator,
  (data, metadata, lookupTables, sharing, collator) => {
    time("select_local_decks");

    const resolvedDecks = Object.keys(data.history).reduce<ResolvedDeck[]>(
      (acc, id) => {
        const deck = data.decks[id];

        try {
          if (deck) {
            const resolved = resolveDeck(
              { metadata, lookupTables, sharing },
              collator,
              deck,
            );
            acc.push(resolved);
          } else {
            console.warn(`Could not find deck ${id} in local storage.`);
          }
        } catch (err) {
          console.error(`Error resolving deck ${id}: ${err}`);
        }

        return acc;
      },
      [],
    );

    resolvedDecks.sort((a, b) =>
      sortAlphabeticalLatin(b.date_update, a.date_update),
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

export const selectLimitOverride = createSelector(
  (state: StoreState) => state.lookupTables,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (_: StoreState, __: ResolvedDeck, code: string) => code,
  (lookupTables, deck, code) => {
    const sealed = deck?.sealedDeck?.cards;
    if (!sealed) return undefined;

    if (sealed[code] != null) return sealed[code];

    const duplicates = lookupTables.relations.duplicates[code];
    if (!duplicates) return undefined;

    for (const duplicateCode of Object.keys(duplicates)) {
      if (sealed[duplicateCode] != null) return sealed[duplicateCode];
    }

    return undefined;
  },
);

export type SlotUpgrade = {
  diff: number;
  card: Card;
};

export type CustomizationUpgrade = {
  diff: Customization[];
  card: Card;
  xpMax: number;
};

export type HistoryEntry = ChangeStats & {
  differences: {
    slots: SlotUpgrade[];
    extraSlots: SlotUpgrade[];
    exileSlots: SlotUpgrade[];
    customizations: CustomizationUpgrade[];
  };
  id: Id;
};

export type History = HistoryEntry[];

function getHistoryEntry(
  changes: ChangeRecord,
  metadata: StoreState["metadata"],
  collator: Intl.Collator,
): HistoryEntry {
  const { customizations, exileSlots, id, stats, tabooSetId } = changes;

  const sortFn = makeSortFunction(["name"], metadata, collator);
  const sortDiff = diffSortingFn(sortFn);

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
    exileSlots: Object.entries(exileSlots ?? {})
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
      .sort((a, b) => sortFn(a.card, b.card)),
  };

  return {
    id,
    ...stats,
    differences,
  };
}

export function getDeckHistory(
  decks: ResolvedDeck[],
  metadata: StoreState["metadata"],
  collator: Intl.Collator,
) {
  const changes: ChangeRecord[] = [];

  for (let i = 0; i < decks.length - 1; i++) {
    const prev = decks[i];
    const next = decks[i + 1];
    changes.unshift(getChangeRecord(prev, next, false));
  }

  const history = changes.map((change) =>
    getHistoryEntry(change, metadata, collator),
  );

  history.push({
    id: decks[0].id,
    changes: {
      exileSlots: {},
      customizations: {},
      slots: {},
      extraSlots: {},
      tabooSetId: null,
    },
    differences: {
      slots: [],
      extraSlots: [],
      exileSlots: [],
      customizations: [],
    },
    xpAvailable: 0,
    xpAdjustment: 0,
    xpSpent: 0,
    xp: 0,
    modifierStats: {},
  } as HistoryEntry);

  return history;
}

export const selectDeckHistoryCached = createSelector(
  (_: StoreState, id: Id) => id,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.data,
  (state: StoreState) => state.sharing,
  (state: StoreState) => state.settings,
  selectLocaleSortingCollator,
  (id, metadata, lookupTables, data, sharing, settings, collator) => {
    const deck = data.decks[id];

    return selectDeckHistory(
      { metadata, lookupTables, data, sharing, settings },
      collator,
      deck,
    );
  },
);

export function selectDeckHistory(
  state: Pick<
    StoreState,
    "metadata" | "lookupTables" | "data" | "sharing" | "settings"
  >,
  collator: Intl.Collator,
  deck: Deck,
) {
  const history = state.data.history[deck.id]
    ? [...state.data.history[deck.id]]
    : [];

  if (!deck || !history.length) return [];

  time("deck_history");

  history.unshift(deck.id);
  history.reverse();

  const resolvedDecks = history.map((deckId) =>
    resolveDeck(
      state,
      collator,
      deckId === deck.id ? deck : state.data.decks[deckId],
    ),
  );

  const deckHistory = getDeckHistory(resolvedDecks, state.metadata, collator);

  timeEnd("deck_history");

  return deckHistory;
}

function diffSortingFn(fallback: (a: Card, b: Card) => number) {
  return (a: SlotUpgrade, b: SlotUpgrade) => {
    const aPos = a.diff > 0;
    const bPos = b.diff > 0;
    if (aPos && !bPos) return -1;
    if (!aPos && bPos) return 1;
    return fallback(a.card, b.card);
  };
}

export const selectLatestUpgrade = createSelector(
  (state: StoreState) => state.metadata,
  selectLocaleSortingCollator,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (state: StoreState, deck: ResolvedDeck) => {
    const prevId = deck?.previous_deck;
    return prevId ? selectResolvedDeckById(state, prevId) : undefined;
  },
  (metadata, collator, next, prev) => {
    if (!prev || !next) return undefined;
    time("latest_upgrade");
    const changes = getChangeRecord(prev, next, false);
    const differences = getHistoryEntry(changes, metadata, collator);
    timeEnd("latest_upgrade");
    return differences as UpgradeStats & HistoryEntry;
  },
);

export const selectLimitedSlotOccupation = createSelector(
  (_: StoreState, deck: ResolvedDeck) => deck,
  (deck) => {
    time("limited_slot_occupation");
    const value = limitedSlotOccupation(deck);
    timeEnd("limited_slot_occupation");
    return value;
  },
);

export const selectDeckGroups = createSelector(
  (state: StoreState) => state.metadata,
  selectLocaleSortingCollator,
  (state: StoreState) => state.settings,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (_: StoreState, __: ResolvedDeck, viewMode: "list" | "scans") => viewMode,
  (metadata, collator, settings, deck, viewMode) =>
    groupDeckCards(
      metadata,
      collator,
      viewMode === "scans" ? settings.lists.deckScans : settings.lists.deck,
      deck,
    ),
);

export const selectUndoHistory = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.sharing,
  (state: StoreState) => state.data,
  selectLocaleSortingCollator,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (metadata, lookupTables, sharing, data, collator, deck) => {
    const prevDeck = data.decks[deck.id];
    if (!prevDeck) return [];

    const prev = resolveDeck(
      { metadata, lookupTables: lookupTables, sharing },
      collator,
      prevDeck,
    );

    const current = {
      data: getHistoryEntry(
        getChangeRecord(prev, deck, true),
        metadata,
        collator,
      ),
      version: "current",
      dateUpdate: new Date().toISOString(),
    };

    if (!data.undoHistory?.[deck.id]) return [current];

    const history = data.undoHistory?.[deck.id].map((undoEntry) => ({
      data: getHistoryEntry(undoEntry.changes, metadata, collator),
      dateUpdate: undoEntry.date_update,
      version: undoEntry.version,
    }));

    return [current, ...history.reverse()];
  },
);
