import { countExperience } from "@/utils/card-utils";
import { ALT_ART_INVESTIGATOR_MAP } from "@/utils/constants";

import type { Card } from "../services/types";
import type { Deck } from "../slices/data/types";
import type { LookupTables } from "../slices/lookup-tables/types";
import type { Metadata } from "../slices/metadata/types";
import { resolveCardWithRelations } from "./card-resolver";
import { decodeCustomizations } from "./customizable";
import type {
  CardWithRelations,
  Customizations,
  DeckMeta,
  ResolvedCard,
  ResolvedDeck,
  Selection,
  Selections,
} from "./types";

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

  const hasExtraDeck = !!investigatorBack.card.side_deck_options;
  const hasParallel = !!investigator.relations?.parallel;
  const hasReplacements = !!investigator.relations?.replacement?.length;

  if (!investigatorFront || !investigatorBack) {
    throw new Error(`Investigator not found: ${deck.investigator_code}`);
  }

  const extraSlots = decodeExtraSlots(deckMeta);
  const customizations = decodeCustomizations(deckMeta, metadata);

  const { cards, deckSize, deckSizeTotal, xpRequired } = getDeckCards<T, S>(
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
    selections: getSelections(investigatorBack, deckMeta),
    sideSlots: Array.isArray(deck.sideSlots) ? null : deck.sideSlots,
    stats: {
      deckSize,
      deckSizeTotal,
      xpRequired: xpRequired,
    },
    tabooSet: deck.taboo_id ? metadata.tabooSets[deck.taboo_id] : undefined,
  };
}

export function decodeDeckMeta(deck: Deck): DeckMeta {
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
  S extends T extends true ? CardWithRelations : ResolvedCard,
>(
  deck: Deck,
  extraSlots: ResolvedDeck<S>["extraSlots"],
  metadata: Metadata,
  lookupTables: LookupTables,
  investigator: CardWithRelations,
  customizations: Customizations | undefined,
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
      customizations,
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
        customizations,
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
        customizations,
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

export function isSpecialCard(
  card: Card,
  investigator: CardWithRelations,
  ignorePermanent = false,
) {
  const isSpecial =
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
    );

  return !!isSpecial || !!(card.permanent && !ignorePermanent);
}

function getSelections(
  investigator: CardWithRelations,
  deckMeta: DeckMeta,
): Selections | undefined {
  const selections = investigator.card.deck_options?.reduce<Selections>(
    (acc, option) => {
      let selection: Selection | undefined;
      let key: string | undefined;

      if (option.deck_size_select) {
        key = option.id ?? "deck_size_selected";

        selection = {
          options: Array.isArray(option.deck_size_select)
            ? option.deck_size_select
            : [option.deck_size_select],
          type: "deckSize",
          accessor: key,
          name: option.name ?? key,
          value: deckMeta.deck_size_selected
            ? Number.parseInt(deckMeta.deck_size_selected, 10)
            : 30,
        };
      } else if (option.faction_select) {
        key = option.id ?? "faction_selected";

        selection = {
          options: option.faction_select,
          type: "faction",
          accessor: key,
          name: option.name ?? key,
          value:
            (option.id
              ? deckMeta[option.id as keyof DeckMeta]
              : deckMeta.faction_selected) ?? undefined,
        };
      } else if (option.option_select) {
        key = option.id ?? "option_selected";

        selection = {
          options: option.option_select,
          type: "option",
          accessor: key,
          name: option.name ?? key,
          value: option.option_select.find(
            (x) => x.id === deckMeta.option_selected,
          ),
        };
      }

      if (!key) return acc;
      if (selection) acc[key] = selection;
      return acc;
    },
    {},
  );

  return selections;
}

function decodeExtraSlots(deckMeta: DeckMeta) {
  if (deckMeta.extra_deck) {
    const extraSlots: Record<string, number> = {};

    for (const code of deckMeta.extra_deck.split(",")) {
      extraSlots[code] = (extraSlots[code] ?? 0) + 1;
    }

    return extraSlots;
  }

  return {};
}
