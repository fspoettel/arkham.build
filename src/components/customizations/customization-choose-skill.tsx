import { Combobox } from "@/components/ui/combobox/combobox";
import type { Coded } from "@/store/services/queries.types";
import { SKILL_KEYS } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";

type Props = {
  disabled?: boolean;
  id: string;
  onChange: (value: string[]) => void;
  readonly?: boolean;
  selections: string[];
};

const itemRenderer = (item: Coded) => (
  <>
    <i className={`icon-${item.code}`} /> {capitalize(item.code)}
  </>
);

export function CustomizationChooseSkill(props: Props) {
  const { disabled, id, onChange, readonly, selections } = props;

  const options = SKILL_KEYS.filter((x) => x !== "wild").map((key) => ({
    code: key,
  }));

  return (
    <Combobox
      disabled={disabled}
      id={`${id}-choose-skill`}
      items={options}
      label="Skill"
      limit={1}
      onValueChange={onChange}
      placeholder="Choose a skill..."
      readonly={readonly}
      renderItem={itemRenderer}
      renderResult={itemRenderer}
      selectedItems={selections}
    />
  );
}
