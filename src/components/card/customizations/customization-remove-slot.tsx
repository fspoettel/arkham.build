import { Select } from "@/components/ui/select";
import type { Card } from "@/store/services/types";
import { splitMultiValue } from "@/utils/card-utils";

type Props = {
  card: Card;
  choice: string;
  id: string;
};

export function CustomizationRemoveSlot({ card, choice, id }: Props) {
  return (
    <Select
      id={`${id}-remove-slot`}
      value={choice}
      options={splitMultiValue(card.original_slot).map((trait, i) => ({
        label: trait,
        value: i.toString(),
      }))}
    />
  );
}
