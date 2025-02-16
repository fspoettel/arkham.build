import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Trans, useTranslation } from "react-i18next";
import type { SettingProps } from "./types";

export function ShowMoveToSideDeckSetting(props: SettingProps) {
  const { settings, updateSettings } = props;
  const { t } = useTranslation();

  const onCheckMoveToSideDeckSetting = (val: boolean | string) => {
    updateSettings((settings) => ({
      ...settings,
      showMoveToSideDeck: !!val,
    }));
  };

  return (
    <Field
      bordered
      helpText={
        <Trans i18nKey={"settings.display.show_move_to_side_deck_help"} t={t}>
          When this is checked a button to move cards to the side deck is
          displayed.
        </Trans>
      }
    >
      <Checkbox
        checked={settings.showMoveToSideDeck}
        label={t("settings.display.show_move_to_side_deck")}
        id="show-move-to-side-deck"
        name="show-move-to-side-deck"
        onCheckedChange={onCheckMoveToSideDeckSetting}
      />
    </Field>
  );
}
