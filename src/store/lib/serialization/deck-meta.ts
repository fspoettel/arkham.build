import type { Deck } from "@/store/slices/data.types";

import type {
  CardWithRelations,
  DeckMeta,
  Selection,
  Selections,
} from "../types";

export function decodeDeckMeta(deck: Deck): DeckMeta {
  try {
    const metaJson = JSON.parse(deck.meta);
    return typeof metaJson === "object" && metaJson != null ? metaJson : {};
  } catch {
    return {};
  }
}

export function decodeSelections(
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
