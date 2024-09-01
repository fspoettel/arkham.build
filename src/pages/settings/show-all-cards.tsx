import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import type { SettingsState } from "@/store/slices/settings.types";
import { useCallback, useState } from "react";

type Props = {
  settings: SettingsState;
};

export function ShowAllCards(props: Props) {
  const { settings } = props;

  const [showAllCards, setShowAllCards] = useState(settings.showAllCards);

  const onCheckShowAll = useCallback((val: boolean | string) => {
    setShowAllCards(!!val);
  }, []);

  return (
    <Field
      bordered
      helpText="When this is checked, the collection settings below are ignored when checking card ownership in card and deck lists."
    >
      <Checkbox
        checked={showAllCards}
        data-testid="settings-show-all"
        id="show-all-cards"
        label="Show all cards as owned"
        name="show-all-cards"
        onCheckedChange={onCheckShowAll}
      />
    </Field>
  );
}