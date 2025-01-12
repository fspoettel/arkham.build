import { useStore } from "@/store";
import { makeSortFunction } from "@/store/lib/sorting";
import type { Card } from "@/store/services/queries.types";
import type { CustomizationOption as CustomizationOptionType } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";
import { time, timeEnd } from "@/utils/time";
import { createSelector } from "reselect";
import { CardsCombobox } from "../cards-combobox";

const selectPlayerCardsForCustomizationOptions = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (_: StoreState, config: CustomizationOptionType["card"] | undefined) =>
    config,
  (metadata, lookupTables, config) => {
    if (!config) return [];

    time("select_player_cards_for_customization_options");

    const options: Set<Card> = new Set();

    const traitTable = lookupTables.traits;
    const typeTable = lookupTables.typeCode;

    const traitTables = config.trait.map((trait) => traitTable[trait]);
    const typeTables = config.type.map((type) => typeTable[type]);

    const codes = [
      ...traitTables.flatMap(Object.keys),
      ...typeTables.flatMap(Object.keys),
    ];

    for (const code of codes) {
      if (
        !traitTables.some((x) => code in x) ||
        !typeTables.every((x) => code in x)
      ) {
        continue;
      }

      const card = metadata.cards[code];

      if (!card || card.duplicate_of_code) {
        continue;
      }

      options.add(card);
    }

    const sortFn = makeSortFunction(["name", "level", "position"], metadata);

    const { cards } = Array.from(options)
      .sort(sortFn)
      .reduce(
        (acc, card) => {
          if (!acc.names.has(card.real_name)) {
            acc.cards.push(card);
            acc.names.add(card.real_name);
          }
          return acc;
        },
        {
          cards: [] as Card[],
          names: new Set<string>(),
        },
      );

    timeEnd("select_player_cards_for_customization_options");

    return cards;
  },
);

type Props = {
  selections: string[];
  config: CustomizationOptionType["card"];
  disabled?: boolean;
  id: string;
  limit: number;
  readonly?: boolean;
  onChange: (selections: string[]) => void;
};

export function CustomizationChooseCards(props: Props) {
  const { selections, config, disabled, id, limit, onChange, readonly } = props;

  const cards = useStore((state) =>
    selectPlayerCardsForCustomizationOptions(state, config),
  );

  return (
    <CardsCombobox
      disabled={disabled}
      id={`${id}-choose-cards`}
      items={cards}
      label="Cards"
      limit={limit}
      onValueChange={onChange}
      readonly={readonly}
      selectedItems={selections}
    />
  );
}
