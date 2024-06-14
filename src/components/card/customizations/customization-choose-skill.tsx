import { Combobox } from "@/components/ui/combobox/combobox";
import type { Coded } from "@/store/services/types";
import { SKILL_KEYS } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";

type Props = {
  choice: string;
  id: string;
};

const itemRenderer = (item: Coded) => (
  <>
    <i className={`icon-${item.code}`} /> {capitalize(item.code)}
  </>
);

export function CustomizationChooseSkill({ choice, id }: Props) {
  const options = SKILL_KEYS.map((key) => ({
    code: key,
  }));

  const selectedItems = choice
    ? {
        [choice]: { code: choice },
      }
    : {};

  return (
    <Combobox
      id={`${id}-choose-skill`}
      label="Skill"
      disabled={!!choice}
      placeholder="Choose a skill..."
      items={options}
      renderItem={itemRenderer}
      renderResult={itemRenderer}
      selectedItems={selectedItems}
    />
  );
}
