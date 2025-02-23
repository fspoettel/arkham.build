import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { HotkeyTooltip } from "@/components/ui/hotkey";
import { useStore } from "@/store";
import { getAdditionalDeckOptions } from "@/store/lib/deck-validation";
import type { ResolvedDeck } from "@/store/lib/types";
import { useHotkey } from "@/utils/use-hotkey";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import css from "./deck-edit.module.css";

type Props = {
  deck: ResolvedDeck;
};

export function CardAccessToggles(props: Props) {
  const { deck } = props;
  const { t } = useTranslation();

  const showUnusable = useStore((state) => state.ui.showUnusableCards);
  const setShowUnusable = useStore((state) => state.setShowUnusableCards);

  const showLimitedAccess = useStore((state) => state.ui.showLimitedAccess);
  const setShowLimitedAccess = useStore((state) => state.setShowLimitedAccess);

  const onShowUnusableChange = useCallback(
    (val: boolean) => {
      setShowUnusable(val);
    },
    [setShowUnusable],
  );

  const onUnusableHotkey = useCallback(() => {
    setShowUnusable(!showUnusable);
  }, [showUnusable, setShowUnusable]);

  useHotkey("alt+u", onUnusableHotkey);

  return (
    <Field bordered className={css["card-access-toggles"]}>
      {hasLimitedSlots(deck) && (
        <Checkbox
          checked={showLimitedAccess}
          id="show-limited-access"
          label={t("deck_edit.actions.show_limited_access")}
          onCheckedChange={setShowLimitedAccess}
        />
      )}
      <HotkeyTooltip
        keybind="alt+u"
        description={t("deck_edit.actions.show_unusable")}
      >
        <Checkbox
          checked={showUnusable}
          id="show-unusable-cards"
          label={t("deck_edit.actions.show_unusable")}
          onCheckedChange={onShowUnusableChange}
        />
      </HotkeyTooltip>
    </Field>
  );
}

function hasLimitedSlots(deck: ResolvedDeck) {
  const options = [
    ...(deck.investigatorBack.card.deck_options ?? []),
    ...getAdditionalDeckOptions(deck),
  ];

  return options ?? false;
}
