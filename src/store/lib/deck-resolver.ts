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

export type ResolvedDeck<T extends CardResolved | CardWithRelations> = Omit<
  Deck,
  "sideSlots"
> & {
  metaParsed: DeckMeta;
  sideSlots: Record<string, number> | null; // arkhamdb stores `[]` when empty, normalize to `null`.
  extraSlots: Record<string, number> | null;
  cards: {
    investigator: CardWithRelations; // tracks relations.
    slots: Record<string, T>;
    sideSlots: Record<string, T>;
    ignoreDeckLimitSlots: Record<string, T>;
    extraSlots: Record<string, T>; // used by parallel jim.
  };
  factionSelect?: {
    options: string[];
    selection?: string;
  };
  investigatorFront: CardResolved; // does not track relations.
  investigatorBack: CardResolved; // does not track relations.
  optionSelect?: {
    options: string[];
    name: string;
    selection?: string;
  };
  stats: {
    xpRequired: number;
    deckSize: number;
    deckSizeTotal: number;
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

  const investigatorFront = getInvestigatorSide(
    investigator,
    deckMeta,
    "alternate_front",
  ) as S;
  const investigatorBack = getInvestigatorSide(
    investigator,
    deckMeta,
    "alternate_back",
  ) as S;

  if (!investigatorFront || !investigatorBack) {
    throw new Error(`Investigator not found: ${deck.investigator_code}`);
  }

  const extraSlots = getExtraSlots(deckMeta);

  const factionSelect = getFactionSelect(investigatorBack, deckMeta);
  const optionSelect = getOptionSelect(investigatorBack, deckMeta);

  const { cards, deckSize, deckSizeTotal, xpRequired } = getDeckCards<T, S>(
    deck,
    extraSlots,
    metadata,
    lookupTables,
    investigator,
    withRelations,
  );

  return {
    ...deck,
    cards,
    extraSlots,
    factionSelect,
    investigatorBack,
    investigatorFront,
    metaParsed: deckMeta,
    optionSelect,
    sideSlots: Array.isArray(deck.sideSlots) ? null : deck.sideSlots,
    stats: {
      deckSize,
      deckSizeTotal,
      xpRequired,
    },
    tabooSet: deck.taboo_id ? metadata.tabooSets[deck.taboo_id] : undefined,
  };
}

function parseDeckMeta(deck: Deck): DeckMeta {
  try {
    const metaJson = JSON.parse(deck.meta);
    return typeof metaJson === "object" && metaJson != null ? metaJson : {};
  } catch {
    return {};
  }
}

function getInvestigatorSide(
  investigator: CardWithRelations,
  deckMeta: DeckMeta,
  key: "alternate_front" | "alternate_back",
) {
  const val = deckMeta[key];
  const hasAlternate = val && val !== investigator.card.code;
  if (!hasAlternate) return investigator;

  if (investigator.relations?.parallel?.card.code === val)
    return investigator.relations?.parallel;

  return investigator;
}

function getDeckCards<
  T extends boolean,
  S extends T extends true ? CardWithRelations : CardResolved,
>(
  deck: Deck,
  extraSlots: ResolvedDeck<S>["extraSlots"],
  metadata: Metadata,
  lookupTables: LookupTables,
  investigator: CardWithRelations,
  withRelations: T,
) {
  const cards: ResolvedDeck<S>["cards"] = {
    investigator: investigator as S,
    slots: {},
    sideSlots: {},
    ignoreDeckLimitSlots: {},
    extraSlots: {},
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
      deckSizeTotal += quantity;
      xpRequired += countExperience(card.card, quantity);
      cards.slots[code] = card as S;
      if (
        !deck.ignoreDeckLimitSlots?.[code] &&
        !isSpecialCard(card.card, investigator)
      ) {
        deckSize += quantity;
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

  if (extraSlots && !Array.isArray(extraSlots)) {
    for (const [code, quantity] of Object.entries(extraSlots)) {
      const card = resolveCardWithRelations(
        metadata,
        lookupTables,
        code,
        deck.taboo_id,
        false,
      ); // SAFE! we do not need relations for side deck.

      if (card) {
        deckSizeTotal += quantity;
        cards.extraSlots[code] = card as S;
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

function getExtraSlots(deckMeta: DeckMeta) {
  if (deckMeta.extra_deck) {
    const extraSlots: Record<string, number> = {};

    for (const code of deckMeta.extra_deck.split(",")) {
      extraSlots[code] = (extraSlots[code] ?? 0) + 1;
    }

    return extraSlots;
  }

  return {};
}
