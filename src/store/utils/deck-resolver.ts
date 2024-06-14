import { countExperience } from "@/utils/card-utils";

import type { Card, TabooSet } from "../services/types";
import type { Deck } from "../slices/decks/types";
import type { LookupTables } from "../slices/lookup-tables/types";
import type { Metadata } from "../slices/metadata/types";
import type { CardResolved, CardWithRelations } from "./card-resolver";
import { resolveCardWithRelations } from "./card-resolver";

type DeckMeta = {
  [key in `cus_${string}`]?: string;
} & {
  alternate_front?: string;
  alternate_back?: string;
  option_selected?: string;
  faction_selected?: string;
  extra_deck?: string;
};

export type ResolvedDeck<T extends CardResolved | CardWithRelations> = Deck & {
  cards: {
    investigator: CardWithRelations; // used to resolve relations.
    slots: Record<string, T>;
    sideSlots: Record<string, T>;
    ignoreDeckLimitSlots: Record<string, T>;
  };
  investigatorFront: T;
  investigatorBack: T;
  stats: {
    xpRequired: number;
    deckSize: number;
    deckSizeTotal: number;
  };
  optionSelect?: {
    options: string[];
    name: string;
    selection?: string;
  };
  factionSelect?: {
    options: string[];
    selection?: string;
  };
  tabooSet?: TabooSet;
};

export function resolveDeck<
  T extends boolean,
  S extends T extends true ? CardWithRelations : CardResolved,
>(
  metadata: Metadata,
  lookupTables: LookupTables,
  deck: Deck,
  withRelations: T,
): ResolvedDeck<S> {
  const deckMeta = parseDeckMeta(deck);

  const investigator = resolveCardWithRelations(
    metadata,
    lookupTables,
    deck.investigator_code,
    deck.taboo_id,
    true,
  ) as CardWithRelations;

  const investigatorFront = getInvestigatorFront(investigator, deckMeta) as S;
  const investigatorBack = getInvestigatorBack(investigator, deckMeta) as S;
  if (!investigatorFront || !investigatorBack) {
    throw new Error(`Investigator not found: ${deck.investigator_code}`);
  }

  const factionSelect = getFactionSelect(investigatorBack, deckMeta);
  const optionSelect = getOptionSelect(investigatorBack, deckMeta);

  const { cards, deckSize, deckSizeTotal, xpRequired } = getDeckCards<T, S>(
    metadata,
    lookupTables,
    investigator,
    deck,
    withRelations,
  );

  return {
    ...deck,
    factionSelect,
    optionSelect,
    investigatorBack,
    investigatorFront,
    stats: {
      deckSize,
      deckSizeTotal,
      xpRequired,
    },
    tabooSet: deck.taboo_id ? metadata.tabooSets[deck.taboo_id] : undefined,
    cards,
  };
}

function parseDeckMeta(deck: Deck) {
  try {
    const metaJson = JSON.parse(deck.meta);
    if (typeof metaJson === "object" && metaJson != null) {
      return metaJson as DeckMeta;
    }
    // eslint-disable-next-line no-empty
  } catch {}
  return {} as DeckMeta;
}

function getDeckCards<
  T extends boolean,
  S extends T extends true ? CardWithRelations : CardResolved,
>(
  metadata: Metadata,
  lookupTables: LookupTables,
  investigator: CardWithRelations,
  deck: Deck,
  withRelations: T,
) {
  const cards: ResolvedDeck<S>["cards"] = {
    investigator: investigator as S,
    slots: {},
    sideSlots: {},
    ignoreDeckLimitSlots: {},
  };

  let deckSize = 0;
  let deckSizeTotal = 0;
  let xpRequired = 0;

  for (const [code, quantity] of Object.entries(deck.slots)) {
    const card = resolveCardWithRelations(
      metadata,
      lookupTables,
      code,
      deck.taboo_id,
      withRelations,
    );

    if (card) {
      if (!isSpecialCard(card.card, investigator)) deckSize += quantity;
      deckSizeTotal += quantity;
      xpRequired += countExperience(card.card, quantity);
      cards.slots[code] = card as S;
    }
  }

  if (deck.ignoreDeckLimitSlots) {
    for (const [code, quantity] of Object.entries(deck.ignoreDeckLimitSlots)) {
      const card = resolveCardWithRelations(
        metadata,
        lookupTables,
        code,
        deck.taboo_id,
        withRelations,
      );

      if (card) {
        deckSizeTotal += quantity;
        cards.ignoreDeckLimitSlots[code] = card as S;
      }
    }
  }

  if (deck.sideSlots && !Array.isArray(deck.sideSlots)) {
    for (const [code] of Object.entries(deck.sideSlots)) {
      const card = resolveCardWithRelations(
        metadata,
        lookupTables,
        code,
        deck.taboo_id,
        false,
      ); // SAFE! we do not need relations for side deck.
      if (card) {
        cards.sideSlots[code] = card as S;
      }
    }
  }

  return {
    cards,
    deckSize,
    deckSizeTotal,
    xpRequired,
  };
}

export function isSpecialCard(card: Card, investigator: CardWithRelations) {
  return (
    card.permanent ||
    card.encounter_code ||
    card.subtype_code ||
    investigator.relations?.advanced?.some((x) => x.card.code === card.code) ||
    investigator.relations?.parallelCards?.some(
      (x) => x.card.code === card.code,
    ) ||
    investigator.relations?.replacement?.some(
      (x) => x.card.code === card.code,
    ) ||
    investigator.relations?.requiredCards?.some(
      (x) => x.card.code === card.code,
    )
  );
}

function getInvestigatorFront(
  investigator: CardWithRelations,
  deckMeta: DeckMeta,
) {
  return deckMeta.alternate_front &&
    deckMeta.alternate_front !== investigator.card.code
    ? investigator.relations?.parallel
    : investigator;
}

function getInvestigatorBack(
  investigator: CardWithRelations,
  deckMeta: DeckMeta,
) {
  return deckMeta.alternate_back &&
    deckMeta.alternate_back !== investigator.card.code
    ? investigator.relations?.parallel
    : investigator;
}

function getFactionSelect(investigator: CardWithRelations, deckMeta: DeckMeta) {
  const hasFactionSelect = investigator.card.deck_options?.some(
    (x) => x.faction_select,
  );

  return hasFactionSelect
    ? {
        options: [], // TODO
        selection: deckMeta.faction_selected,
      }
    : undefined;
}

function getOptionSelect(investigator: CardWithRelations, deckMeta: DeckMeta) {
  const optionSelectType = investigator.card.deck_options?.find(
    (x) => x.option_select,
  );
  if (!optionSelectType?.name) return undefined;

  const selection = optionSelectType.option_select?.find(
    (x) => x.id === deckMeta.option_selected,
  );

  return {
    name: optionSelectType.name,
    options: [], // TODO
    selection: selection?.name,
  };
}
