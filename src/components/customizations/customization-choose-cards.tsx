import { ListCardInner } from "@/components/list-card/list-card-inner";
import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import { sortAlphabetically } from "@/store/lib/sorting";
import type { Card } from "@/store/services/queries.types";
import type { CustomizationOption as CustomizationOptionType } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";

function selectPlayerCardsForCustomizationOptions(
  state: StoreState,
  config: CustomizationOptionType["card"],
) {
  if (!config) return [];

  console.time("[perf] select_player_cards_for_customization_options");

  const options: Set<Card> = new Set();

  const traitTable = state.lookupTables.traits;
  const typeTable = state.lookupTables.typeCode;

  const traitTables = config.trait.map((trait) => traitTable[trait]);
  const typeTables = config.type.map((type) => typeTable[type]);

  [
    ...traitTables.flatMap(Object.keys),
    ...typeTables.flatMap(Object.keys),
  ].forEach((code) => {
    if (
      !traitTables.some((x) => code in x) ||
      !typeTables.every((x) => code in x)
    ) {
      return;
    }

    const card = state.metadata.cards[code];
    if (!card || card.duplicate_of_code) return;

    options.add(card);
  }, []);

  const cards = Array.from(options).toSorted(
    sortAlphabetically(state.lookupTables),
  );

  console.timeEnd("[perf] select_player_cards_for_customization_options");

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
