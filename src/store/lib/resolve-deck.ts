import { ALT_ART_INVESTIGATOR_MAP } from "@/utils/constants";

import type { Deck } from "../slices/data.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";
import { resolveCardWithRelations } from "./resolve-card";
import { decodeCustomizations } from "./serialization/customizable";
import { decodeDeckMeta, decodeSelections } from "./serialization/deck-meta";
import { decodeExtraSlots, decodeSlots } from "./serialization/slots";
import type {
  CardWithRelations,
  DeckMeta,
  ResolvedCard,
  ResolvedDeck,
} from "./types";

/**
 * Given a decoded deck, resolve all cards and metadata for display.
 */
export function resolveDeck<
  T extends boolean,
  S extends T extends true ? CardWithRelations : ResolvedCard,
>(
  metadata: Metadata,
  lookupTables: LookupTables,
  deck: Deck,
  withRelations: T,
): ResolvedDeck<S> {
  const deckMeta = decodeDeckMeta(deck);

  // some decks on arkhamdb are created for the replacement investigator, normalize.
  // this only seems to be the case for carolyn fern?
  const investigatorCode =
    deck.investigator_code in ALT_ART_INVESTIGATOR_MAP
      ? ALT_ART_INVESTIGATOR_MAP[
          deck.investigator_code as keyof typeof ALT_ART_INVESTIGATOR_MAP
        ]
      : deck.investigator_code;

  const investigator = resolveCardWithRelations(
    metadata,
    lookupTables,
    investigatorCode,
    deck.taboo_id,
    undefined,
    true,
  ) as CardWithRelations;

  if (!investigator) {
    throw new Error(
      `Investigator not found in store: ${deck.investigator_code}`,
    );
  }

  const investigatorFront = getInvestigatorForSide(
    investigator,
    deckMeta,
    "alternate_front",
  ) as S;

  const investigatorBack = getInvestigatorForSide(
    investigator,
    deckMeta,
    "alternate_back",
  ) as S;

  const hasExtraDeck = !!investigatorBack.card.side_deck_options;
  const hasParallel = !!investigator.relations?.parallel;
  const hasReplacements = !!investigator.relations?.replacement?.length;

  if (!investigatorFront || !investigatorBack) {
    throw new Error(`Investigator not found: ${deck.investigator_code}`);
  }

  const extraSlots = decodeExtraSlots(deckMeta);
  const customizations = decodeCustomizations(deckMeta, metadata);

  const { cards, deckSize, deckSizeTotal, xpRequired } = decodeSlots<T, S>(
    deck,
    extraSlots,
    metadata,
    lookupTables,
    investigator,
    customizations,
    withRelations,
  );

  return {
    ...deck,
    cards,
    customizations,
    extraSlots,
    investigatorBack,
    investigatorFront,
    metaParsed: deckMeta,
    hasExtraDeck,
    hasParallel,
    hasReplacements,
    selections: decodeSelections(investigatorBack, deckMeta),
    sideSlots: Array.isArray(deck.sideSlots) ? {} : deck.sideSlots,
    stats: {
      deckSize,
      deckSizeTotal,
      xpRequired: xpRequired,
    },
    tabooSet: deck.taboo_id ? metadata.tabooSets[deck.taboo_id] : undefined,
  };
}

function getInvestigatorForSide(
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
