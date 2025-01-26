import { ListCardInner } from "@/components/list-card/list-card-inner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store";
import type { SettingsState } from "@/store/slices/settings.types";
import { useCallback, useMemo, useState } from "react";
import css from "./card-level-display.module.css";
import type { SettingProps } from "./types";

const PREVIEW_CARDS = ["01033", "11076", "10035"];

type Option = SettingsState["cardLevelDisplay"];

export function CardLevelDisplaySetting(props: SettingProps) {
  const { settings, updateSettings } = props;

  const metadata = useStore((state) => state.metadata);

  const [liveValue, setLiveValue] = useState<Option>(
    settings.cardLevelDisplay ?? "icon-only",
  );

  const options = useMemo(
    () => [
      { value: "icon-only", label: "In card icon only" },
      { value: "dots", label: "In card icon and as dots" },
      { value: "text", label: "In card icon and as text" },
    ],
    [],
  );

  const onChangeValue = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const value = evt.target.value as Option;
      setLiveValue(value);
      updateSettings({
        ...settings,
        cardLevelDisplay: value,
      });
    },
    [updateSettings, settings],
  );

  return (
    <Field className={css["field"]} bordered>
      <FieldLabel htmlFor="display-card-level">
        <i className="icon-xp-bold" />
        Card level display
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
        <h4>Preview</h4>
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
