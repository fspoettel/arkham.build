import { ListCardInner } from "@/components/list-card/list-card-inner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store";
import { selectMetadata } from "@/store/selectors/shared";
import type { SettingsState } from "@/store/slices/settings.types";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import css from "./card-level-display.module.css";
import type { SettingProps } from "./types";

const PREVIEW_CARDS = ["01033", "11076", "10035"];

type Option = SettingsState["cardLevelDisplay"];

export function CardLevelDisplaySetting(props: SettingProps) {
  const { settings, setSettings } = props;
  const { t } = useTranslation();

  const metadata = useStore(selectMetadata);

  const [liveValue, setLiveValue] = useState<Option>(
    settings.cardLevelDisplay ?? "icon-only",
  );

  const options = useMemo(
    () => [
      { value: "icon-only", label: t("settings.display.card_level_icon_only") },
      { value: "dots", label: t("settings.display.card_level_as_dots") },
      { value: "text", label: t("settings.display.card_level_as_text") },
    ],
    [t],
  );

  const onChangeValue = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const value = evt.target.value as Option;
      setLiveValue(value);
      setSettings({
        ...settings,
        cardLevelDisplay: value,
      });
    },
    [setSettings, settings],
  );

  return (
    <Field className={css["field"]} bordered>
      <FieldLabel htmlFor="display-card-level">
        <i className="icon-xp-bold" />
        {t("settings.display.card_level")}
      </FieldLabel>
      <div>
        <Select
          className={css["input"]}
          onChange={onChangeValue}
          options={options}
          required
          name="display-card-level"
          defaultValue={settings.cardLevelDisplay ?? "icon-only"}
        />
      </div>
      <div className={css["preview"]}>
        <h4>{t("settings.preview")}</h4>
        <ol>
          {PREVIEW_CARDS.map((id) => (
            <ListCardInner
              cardLevelDisplay={liveValue}
              as="li"
              key={id}
              card={metadata.cards[id]}
              omitBorders
            />
          ))}
        </ol>
      </div>
    </Field>
  );
}
