import { useTranslation } from "react-i18next";
import { TabooSelect } from "@/components/taboo-select";
import { Field, FieldLabel } from "@/components/ui/field";
import type { DecklistFilterProps } from "./shared";

export function TabooList({ formState, setFormState }: DecklistFilterProps) {
  const { t } = useTranslation();

  return (
    <Field full>
      <FieldLabel htmlFor="taboo-id">{t("common.taboo")}</FieldLabel>
      <TabooSelect
        id="taboo-id"
        onChange={(evt) => {
          const tabooId = Number.parseInt(evt.target.value, 10);
          setFormState((prev) => ({
            ...prev,
            taboo_id: Number.isNaN(tabooId) ? undefined : tabooId,
          }));
        }}
        value={formState.taboo_id}
      />
    </Field>
  );
}
