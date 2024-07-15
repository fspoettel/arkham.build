import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { Card, CustomizationOption } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";
import type { Deck, DeckProblem } from "@/store/slices/data.types";
import { splitMultiValue } from "@/utils/card-utils";
import {
  capitalize,
  formatSelectionId,
  formatTabooSet,
} from "@/utils/formatting";
import type { DisplayDeck, Grouping } from "../deck-grouping";
import { sortByName, sortBySlots } from "../sorting";
import type { Customizations } from "../types";

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

export function formatDeckExport(
  _deck: Deck,
  validationResult: DeckValidationResult,
): Deck {
  const deck = structuredClone(_deck);
  deck.problem = mapValidationToProblem(validationResult);
  deck.source = undefined;
  return deck;
}

// This is very ugly, but not a hot path, so who cares.
export function formatDeckAsText(state: StoreState, deck: DisplayDeck) {
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
          : selection.value?.name ?? "None";

      text += `${formatSelectionId(key)}: ${value}  \n`;
    }
  }

  text += `\nExperience: ${deck.stats.xpRequired}  \n`;

  if (deck.tabooSet) {
    text += `Taboo†: ${formatTabooSet(deck.tabooSet)}  \n`;
  }

  text += `\n## Deck\n\n${formatGrouping(state, deck.groups.main.data, deck.slots, deck.customizations)}`;

  if (deck.groups.extra && deck.extraSlots) {
    text += `## Spirits\n\n${formatGrouping(state, deck.groups.extra.data, deck.extraSlots, {})}`;
  }

  return text;
}

// FIXME: rework this once deck groups are using the same grouping logic as lists, it's needlessly complex.
function formatGrouping(
  state: StoreState,
  grouping: Grouping,
  slots: { [code: string]: number },
  customizations?: Customizations,
) {
  let text = "";

  for (const [section, data] of Object.entries(grouping)) {
    if (section === "asset") {
      text += "**Asset**  \n";

      const groups = Object.entries(data).toSorted((a, b) =>
        sortBySlots(a[0], b[0]),
      );

      const entries = groups.map(([key, cards]) => {
        return formatGroupAsText(
          state,
          key,
          cards,
          slots,
          customizations,
          false,
        );
      });

      text += `${entries.join("\n")}\n`;
    } else {
      text += formatGroupAsText(
        state,
        section,
        data as Card[],
        slots,
        customizations,
        true,
      );
    }
  }

  return text;
}

function formatGroupAsText(
  state: StoreState,
  title: string,
  data: Card[],
  quantities: { [code: string]: number },
  customizations: Customizations | undefined,
  isMain: boolean,
) {
  if (!data.length) return "";

  const labelStr = capitalize(title);
  const label = isMain ? `**${labelStr}**` : `_${labelStr}_`;

  const cards = data
    .toSorted((a, b) => sortByName(a, b))
    .map((c) => formatCardAsText(state, c, quantities, customizations))
    .join("\n");

  return `${label}\n${cards}\n${isMain ? "\n" : ""}`;
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
