import type { Modifier } from "@/store/lib/deck-upgrades";
import type { ResolvedDeck } from "@/store/lib/types";
import type { History } from "@/store/selectors/decks";
import { formatUpgradeXP } from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import { CustomizableDiff } from "./customizable-diff";
import css from "./deck-history.module.css";
import { SlotDiff } from "./slot-diff";

type Props = {
  deck: ResolvedDeck;
  history: History;
};

export function DeckHistory(props: Props) {
  const { deck, history } = props;

  const { t } = useTranslation();

  return (
    <ol className={css["entries"]} data-testid="history">
      {history.map((stats, idx) => {
        const hasChanges =
          !isEmpty(stats.differences.slots) ||
          !isEmpty(stats.differences.extraSlots) ||
          !isEmpty(stats.differences.customizations) ||
          !isEmpty(stats.differences.exileSlots);

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: no natural key available.
          <li className={css["entry"]} key={idx}>
            <h3 className={css["entry-title"]}>
              {idx === 0
                ? t("deck_view.history.current_upgrade")
                : t("deck_view.history.upgrade", {
                    index: history.length - idx,
                  })}
            </h3>
            <p className={css["entry-stats"]}>
              {formatUpgradeXP(stats.xp, stats.xpAdjustment, stats.xpSpent)}
            </p>
            <div className={css["entry-container"]}>
              {hasChanges && (
                <>
                  <div className={css["entry-row"]}>
                    <SlotDiff
                      deck={deck}
                      title={`${t("common.decks.slots")} ${t("common.change", { count: 2 })}`}
                      differences={stats.differences.slots}
                    />
                    <SlotDiff
                      deck={deck}
                      title={`${t("common.decks.extraSlots")} ${t("common.change", { count: 2 })}`}
                      differences={stats.differences.extraSlots}
                    />
                  </div>
                  <div className={css["entry-row"]}>
                    <SlotDiff
                      deck={deck}
                      title={`${t("common.exiled")} ${t("common.card", { count: 2 })}`}
                      differences={stats.differences.exileSlots}
                    />
                    <CustomizableDiff
                      deck={deck}
                      title={t("common.customizations")}
                      differences={stats.differences.customizations}
                    />
                  </div>
                </>
              )}
              {!hasChanges && t("deck_view.history.no_changes")}
            </div>
            {!isEmpty(stats.modifierStats) && (
              <div className={css["discount-container"]}>
                <h4>{t("deck_view.history.discounts")}</h4>
                <dl className={css["discounts"]}>
                  {Object.entries(stats.modifierStats).map(
                    ([modifier, value]) => (
                      <Fragment key={modifier}>
                        <dt>{formatModifier(modifier as Modifier)}</dt>
                        <dd>
                          {value.used} / {value.available}
                        </dd>
                      </Fragment>
                    ),
                  )}
                </dl>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function formatModifier(modifier: Modifier) {
  if (modifier === "adaptable") return "Adaptable";
  if (modifier === "arcaneResearch") return "Arcane Research";
  if (modifier === "dejaVu") return "Déjà Vu";
  if (modifier === "downTheRabbitHole") return "Down the Rabbit Hole";
  return modifier;
}
