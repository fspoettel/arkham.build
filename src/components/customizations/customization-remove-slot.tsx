import { Select } from "@/components/ui/select";
import type { Card } from "@/store/services/queries.types";
import { splitMultiValue } from "@/utils/card-utils";

type Props = {
  card: Card;
  disabled?: boolean;
  id: string;
  onChange: (selections: string[]) => void;
  selections: string[];
};

export function CustomizationRemoveSlot({
  card,
  disabled,
  onChange,
  id,
  selections,
}: Props) {
  const onValueChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    if (evt.target instanceof HTMLSelectElement) {
      onChange([evt.target.value]);
    }
  };

  return (
    <Select
      defaultValue={selections[0] || ""}
      disabled={disabled}
      id={`${id}-remove-slot`}
      onChange={onValueChange}
      options={splitMultiValue(card.original_slot).map((trait, i) => ({
        label: trait,
        value: i.toString(),
      }))}
    />
  );
}
