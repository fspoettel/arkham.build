import { ListCardInner } from "@/components/list-card/list-card-inner";
import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import { sortByName } from "@/store/lib/sorting";
import type { Card } from "@/store/services/queries.types";
import type { CustomizationOption as CustomizationOptionType } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";
import { time, timeEnd } from "@/utils/time";

function selectPlayerCardsForCustomizationOptions(
  state: StoreState,
  config: CustomizationOptionType["card"],
) {
  if (!config) return [];

  time("select_player_cards_for_customization_options");

  const options: Set<Card> = new Set();

  const traitTable = state.lookupTables.traits;
  const typeTable = state.lookupTables.typeCode;

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

    const card = state.metadata.cards[code];
    if (!card || card.duplicate_of_code) {
      continue;
    }

    options.add(card);
  }

  const cards = Array.from(options).toSorted(sortByName);

  timeEnd("select_player_cards_for_customization_options");

  return cards;
}

const cardRenderer = (item: Card) => <ListCardInner card={item} size="sm" />;

const resultRenderer = (item: Card) => item.real_name;

const itemToString = (item: Card) => item.real_name.toLowerCase();

type Props = {
  selections: string[];
  config: CustomizationOptionType["card"];
  disabled?: boolean;
  id: string;
  limit: number;
  onChange: (selections: string[]) => void;
};

export function CustomizationChooseCards({
  config,
  disabled,
  id,
  limit,
  onChange,
  selections,
}: Props) {
  const cards = useStore((state) =>
    selectPlayerCardsForCustomizationOptions(state, config),
  );

  return (
    <Combobox
      disabled={disabled}
      id={`${id}-choose-cards`}
      itemToString={itemToString}
      items={cards}
      label="Cards"
      limit={limit}
      onValueChange={onChange}
      placeholder="Select cards..."
      renderItem={cardRenderer}
      renderResult={resultRenderer}
      selectedItems={selections}
    />
  );
}
