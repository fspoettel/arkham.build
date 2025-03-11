import { decodeExileSlots } from "@/utils/card-utils";
import {
  ALT_ART_INVESTIGATOR_MAP,
  type AttachableDefinition,
  getAttachableCards,
} from "@/utils/constants";
import { isEmpty } from "@/utils/is-empty";
import type { StoreState } from "../slices";
import type { Deck } from "../slices/data.types";
import {
  decodeAnnotations,
  decodeAttachments,
  decodeCardPool,
  decodeCustomizations,
  decodeDeckMeta,
  decodeSealedDeck,
  decodeSelections,
} from "./deck-meta";
import { resolveCardWithRelations } from "./resolve-card";
import { decodeExtraSlots, decodeSlots } from "./slots";
import type { CardWithRelations, DeckMeta, ResolvedDeck } from "./types";

/**
 * Given a decoded deck, resolve all cards and metadata for display.
 */
export function resolveDeck(
  state: Pick<StoreState, "metadata" | "lookupTables" | "sharing">,
  collator: Intl.Collator,
  deck: Deck,
): ResolvedDeck {
  const deckMeta = decodeDeckMeta(deck);
  // some decks on arkhamdb are created for the replacement investigator, normalize.
  const investigatorCode =
    deck.investigator_code in ALT_ART_INVESTIGATOR_MAP
      ? ALT_ART_INVESTIGATOR_MAP[
          deck.investigator_code as keyof typeof ALT_ART_INVESTIGATOR_MAP
        ]
      : deck.investigator_code;

  const investigator = resolveCardWithRelations(
    state,
    collator,
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
    state,
    collator,
    deck.taboo_id,
    investigator,
    deckMeta,
    "alternate_front",
  );

  const investigatorBack = getInvestigatorForSide(
    state,
    collator,
    deck.taboo_id,
    investigator,
    deckMeta,
    "alternate_back",
  );

  const hasExtraDeck = !!investigatorBack.card.side_deck_options;
  const hasParallel = !!investigator.relations?.parallel;
  const hasReplacements = !isEmpty(investigator.relations?.replacement);

  if (!investigatorFront || !investigatorBack) {
    throw new Error(`Investigator not found: ${deck.investigator_code}`);
  }

  const cardPool = decodeCardPool(deckMeta);

  const sealedDeck = decodeSealedDeck(deckMeta);

  const exileSlots = decodeExileSlots(deck.exile_string);

  const extraSlots = decodeExtraSlots(deckMeta);

  const customizations = decodeCustomizations(deckMeta, state.metadata);

  const { bondedSlots, cards, deckSize, deckSizeTotal, xpRequired, charts } =
    decodeSlots(
      state,
      collator,
      deck,
      extraSlots,
      investigator,
      customizations,
    );

  const availableAttachments = Object.entries(getAttachableCards()).reduce<
    AttachableDefinition[]
  >((acc, [code, value]) => {
    if (investigatorBack.card.code === code || !!deck.slots[code]) {
      acc.push(value);
    }

    return acc;
  }, []);

  const resolved = {
    ...deck,
    bondedSlots,
    annotations: decodeAnnotations(deckMeta),
    attachments: decodeAttachments(deckMeta),
    availableAttachments,
    cardPool,
    cards,
    customizations,
    extraSlots,
    exileSlots: exileSlots,
    investigatorBack,
    investigatorFront,
    metaParsed: deckMeta,
    hasExtraDeck,
    hasParallel,
    hasReplacements,
    originalDeck: deck,
    sealedDeck,
    selections: decodeSelections(investigatorBack, deckMeta),
    sideSlots: Array.isArray(deck.sideSlots) ? {} : deck.sideSlots,
    shared: !!state.sharing.decks[deck.id],
    stats: {
      deckSize,
      deckSizeTotal,
      xpRequired: xpRequired,
      charts,
    },
    tabooSet: deck.taboo_id
      ? state.metadata.tabooSets[deck.taboo_id]
      : undefined,
  } as ResolvedDeck;

  return resolved as ResolvedDeck;
}

function getInvestigatorForSide(
  state: Pick<StoreState, "metadata" | "lookupTables">,
  collator: Intl.Collator,
  tabooId: number | undefined | null,
  investigator: CardWithRelations,
  deckMeta: DeckMeta,
  key: "alternate_front" | "alternate_back",
) {
  if (deckMeta.transform_into) {
    return resolveCardWithRelations(
      state,
      collator,
      deckMeta.transform_into,
      tabooId,
      undefined,
      true,
    ) as CardWithRelations;
  }

  const val = deckMeta[key];

  const hasAlternate = val && val !== investigator.card.code;
  if (!hasAlternate) return investigator;

  if (investigator.relations?.parallel?.card.code === val) {
    return investigator.relations?.parallel;
  }

  return investigator;
}

export function getDeckLimitOverride(
  deck: ResolvedDeck | undefined,
  code: string,
): number | undefined {
  return deck?.sealedDeck?.cards[code];
}

export function deckTags(deck: ResolvedDeck) {
  return (
    deck.tags
      ?.trim()
      .split(" ")
      .filter((x) => x) ?? []
  );
}

export function extendedDeckTags(deck: ResolvedDeck, includeCardPool = false) {
  const tags = [];

  if (deck.source === "arkhamdb") {
    tags.push("arkhamdb");
  } else if (deck.shared) {
    tags.push("shared");
  } else {
    tags.push("private");
  }

  if (includeCardPool) {
    if (deck.metaParsed.card_pool) {
      tags.push("limited pool");
    }

    if (deck.metaParsed.sealed_deck) {
      tags.push("sealed");
    }
  }
  tags.push(...deckTags(deck));
  return tags;
}
