import {
  type DeckValidationResult,
  validateDeck,
} from "@/store/lib/deck-validation";
import type { Card, CustomizationOption } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";
import type { Deck, DeckProblem, Id } from "@/store/slices/data.types";
import { splitMultiValue } from "@/utils/card-utils";
import { randomId } from "@/utils/crypto";
import {
  capitalize,
  capitalizeSnakeCase,
  formatTabooSet,
} from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { getInitialSettings } from "../slices/settings";
import {
  type DeckGrouping,
  groupDeckCards,
  isGroupCollapsed,
  resolveParents,
  resolveQuantities,
} from "./deck-grouping";
import { getGroupingKeyLabel } from "./grouping";
import { resolveDeck } from "./resolve-deck";
import { sortByName } from "./sorting";
import type { Customizations, ResolvedDeck } from "./types";

export function formatDeckImport(
  state: StoreState,
  deck: Deck,
  type: string,
): Deck {
  const now = new Date().toISOString();

  const validation = validateDeck(
    resolveDeck(state.metadata, state.lookupTables, state.sharing, deck),
    state,
  );

  const problem = mapValidationToProblem(validation);

  const cleanedDeck = Object.entries(deck).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (isApiDeckKey(key)) {
        acc[key] = value;
      }

      return acc;
    },
    {},
  );

  return {
    ...(cleanedDeck as Deck),
    id: randomId(),
    problem,
    date_creation: now,
    date_update: now,
    tags:
      type === "decklist"
        ? (deck.tags?.replaceAll(", ", " ") ?? null)
        : deck.tags,
    previous_deck: null,
    next_deck: null,
    xp: null,
    xp_adjustment: null,
    xp_spent: null,
  };
}

export function formatDeckShare(
  _deck: Deck,
  previousDeck: Id | null = null,
): Deck {
  const deck = structuredClone(_deck);
  deck.previous_deck = previousDeck;
  deck.source = undefined;
  deck.next_deck = null;
  return deck;
}

export function mapValidationToProblem(
  validation: DeckValidationResult,
): DeckProblem | null {
  if (validation.valid) return null;

  const error = validation.errors[0];
  if (!error) return null;

  switch (error.type) {
    case "TOO_FEW_CARDS":
      return "too_few_cards";
    case "TOO_MANY_CARDS":
      return "too_many_cards";
    case "INVALID_CARD_COUNT":
      return "too_many_copies";
    case "INVALID_DECK_OPTION":
      return "deck_options_limit";
    case "FORBIDDEN":
      return "invalid_cards";
    default:
      return "investigator";
  }
}

// This is very ugly, but not a hot path, so who cares.
export function formatDeckAsText(state: StoreState, deck: ResolvedDeck) {
  let text = "";

  text += `# ${deck.name}\n\n`;
  text += `Investigator: ${deck.cards.investigator.card.real_name}  \n`;

  if (deck.hasParallel) {
    const front =
      deck.cards.investigator.card.code === deck.investigatorFront.card.code
        ? "Original Front"
        : "Parallel Front";

    const back =
      deck.cards.investigator.card.code === deck.investigatorBack.card.code
        ? "Original Back"
        : "Parallel Back";

    text += `Parallel: ${front}, ${back}  \n`;
  }

  if (deck.selections) {
    for (const [key, selection] of Object.entries(deck.selections)) {
      const value =
        typeof selection.value !== "object"
          ? typeof selection.value === "string"
            ? capitalize(selection.value)
            : selection.value
          : (selection.value?.name ?? "None");

      text += `${capitalizeSnakeCase(key)}: ${value}  \n`;
    }
  }

  text += `\nExperience: ${deck.stats.xpRequired}  \n`;

  if (deck.tabooSet) {
    text += `Taboo†: ${formatTabooSet(deck.tabooSet)}  \n`;
  }

  const groups = groupDeckCards(
    state.metadata,
    getInitialSettings().lists.deck,
    deck,
  );

  if (groups.slots && !isEmpty(deck.slots)) {
    text += `\n## Deck\n\n${formatGrouping(state, groups.slots, deck.slots, deck.customizations)}`;
  }

  if (groups.sideSlots && !isEmpty(deck.sideSlots)) {
    text += `\n## Side deck\n\n${formatGrouping(state, groups.sideSlots, deck.sideSlots, {})}`;
  }

  if (groups.extraSlots && deck.extraSlots) {
    text += `## Spirits\n\n${formatGrouping(state, groups.extraSlots, deck.extraSlots, {})}`;
  }

  return text;
}

function formatGrouping(
  state: StoreState,
  grouping: DeckGrouping,
  slots: { [code: string]: number },
  customizations?: Customizations,
) {
  let text = "";

  const quantities = resolveQuantities(grouping);

  const seenParents = new Set<string>();

  grouping.data.forEach((group, i) => {
    const parents = resolveParents(grouping, group).filter(
      (parent) => !seenParents.has(parent.key),
    );

    parents.forEach((parent, _) => {
      seenParents.add(parent.key);
      const key = parent.key.split("|").at(-1) as string;
      const type = parent.type.split("|").at(-1) as string;
      text += `**${getGroupingKeyLabel(type, key, state.metadata)}** (${quantities.get(parent.key) ?? 0})  \n`;
    });

    if (!isGroupCollapsed(group)) {
      const key = group.key.split("|").at(-1) as string;
      const type = group.type.split("|").at(-1) as string;
      text += `_${getGroupingKeyLabel(type, key, state.metadata)}_ (${quantities.get(group.key) ?? 0})  \n`;
    }

    text += formatGroupAsText(state, group.cards, slots, customizations);
    if (i < grouping.data.length - 1) text += "\n";
  });

  return text;
}

function formatGroupAsText(
  state: StoreState,
  data: Card[],
  quantities: { [code: string]: number },
  customizations: Customizations | undefined,
) {
  if (!data.length) return "";

  const cards = [...data]
    .sort((a, b) => sortByName(a, b))
    .map((c) => formatCardAsText(state, c, quantities, customizations))
    .join("\n");

  return `${cards}\n`;
}

function formatCardAsText(
  state: StoreState,
  card: Card,
  quantities: { [code: string]: number },
  customizations: Customizations | undefined,
) {
  const customizable = !!card.customization_options;
  const quantity = quantities[card.code] ?? 0;
  const cardStr = `- ${card.real_name}${card.taboo_set_id ? "†" : ""}${card.xp ? ` (${card.xp})` : ""}${customizable ? " (C)" : ""}${quantity > 1 ? ` x${quantity}` : ""}`;

  if (customizable && customizations && card.real_customization_text) {
    const optionNames = card.real_customization_text
      .replaceAll("□", "")
      .replaceAll("<b>", "")
      .replaceAll("</b>", "")
      .replaceAll("[[", "")
      .replaceAll("]]", "")
      .replaceAll("_____", "")
      .split("\n")
      .map((n) => {
        const val = n.split(".")[0].trim();
        return val.endsWith(":") ? `${val}` : `${val}.`;
      });

    const options = card.customization_options as CustomizationOption[];

    const customizationText = options
      .reduce<string[]>((acc, option, i) => {
        const name = optionNames[i].trim();
        const choice = customizations[card.code]?.[i];

        if (choice && choice.xp_spent >= option.xp) {
          const selection = formatCustomizableSelection(
            state,
            card,
            option,
            choice.selections ?? "",
          );

          const text = `  - ${name}`;

          if (option.choice) {
            if (text.endsWith(".")) {
              acc.push(`${text} Choice: ${selection ?? ""}`);
            } else {
              acc.push(`${text} ${selection ?? ""}`);
            }
          } else {
            acc.push(text);
          }
        }

        return acc;
      }, [])
      .join("\n");

    if (customizationText) {
      return `${cardStr}\n${customizationText}`;
    }
  }

  return cardStr;
}

function formatCustomizableSelection(
  state: StoreState,
  card: Card,
  option: CustomizationOption,
  selection: string | undefined,
) {
  if (selection == null) return undefined;

  const selections = selection.split("^");

  if (option.choice === "choose_card") {
    return selections
      .map((code) => state.metadata.cards[code]?.real_name ?? "")
      .join(", ");
  }

  if (option.choice === "remove_slot") {
    return selections
      .map((s) => {
        const slot = splitMultiValue(card.original_slot);
        return slot[Number.parseInt(s, 10)];
      })
      .join(", ");
  }

  return selections.map(capitalize).join(", ");
}

function isApiDeckKey(key: string): key is keyof Deck {
  return [
    "date_creation",
    "date_update",
    "description_md",
    "exile_string",
    "ignoreDeckLimitSlots",
    "id",
    "investigator_code",
    "meta",
    "name",
    "next_deck",
    "previous_deck",
    "problem",
    "sideSlots",
    "slots",
    "taboo_id",
    "tags",
    "version",
    "xp_adjustment",
    "xp_spent",
    "xp",
  ].includes(key);
}
