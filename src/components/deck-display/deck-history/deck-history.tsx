import type { Modifier } from "@/store/lib/deck-upgrades";
import type { ResolvedDeck } from "@/store/lib/types";
import type { History } from "@/store/selectors/decks";
import { formatUpgradeXP } from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import type { TFunction } from "i18next";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import { Link } from "wouter";
import type { DeckOrigin } from "../types";
import { CustomizableDiff } from "./customizable-diff";
import css from "./deck-history.module.css";
import { SlotDiff } from "./slot-diff";

type Props = {
  deck: ResolvedDeck;
  history: History;
  origin: DeckOrigin;
};

export function DeckHistory(props: Props) {
  const { deck, history, origin } = props;

  const { t } = useTranslation();

  const prefix = origin === "share" ? "~/share" : "~/deck/view";

  return (
    <ol className={css["entries"]} data-testid="history">
      {history.map((stats, idx) => {
        const hasChanges =
          !isEmpty(stats.differences.slots) ||
          !isEmpty(stats.differences.extraSlots) ||
          !isEmpty(stats.differences.customizations) ||
          !isEmpty(stats.differences.exileSlots);

        const isLast = idx === history.length - 1;
        const isCurrent = idx === 0;

        const title = isCurrent
          ? t("deck_view.history.current_upgrade")
          : isLast
            ? t("deck_view.history.initial_deck")
            : t("deck_view.history.upgrade", {
                index: history.length - idx - 1,
              });

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: no natural key available.
          <li className={css["entry"]} key={idx}>
            <h3 className={css["entry-title"]}>
              {idx === 0 ? (
                title
              ) : (
                <Link to={`${prefix}/${stats.id}`}>
                  {title}
                  <SquareArrowOutUpRightIcon />
                </Link>
              )}
            </h3>
            {!isLast && (
              <p className={css["entry-stats"]}>
                {formatUpgradeXP(stats.xp, stats.xpAdjustment, stats.xpSpent)}
              </p>
            )}
            <div className={css["entry-container"]}>
              {hasChanges && (
                <>
                  <div className={css["entry-row"]}>
                    <SlotDiff
                      deck={deck}
                      title={t("deck_view.history.slot_changes", {
                        slot: t("common.decks.slots"),
                      })}
                      differences={stats.differences.slots}
                      omitHeadings
                    />
                    <SlotDiff
                      deck={deck}
                      title={t("deck_view.history.slot_changes", {
                        slot: t("common.decks.extraSlots"),
                      })}
                      differences={stats.differences.extraSlots}
                      omitHeadings
                    />
                  </div>
                  <div className={css["entry-row"]}>
                    <SlotDiff
                      deck={deck}
                      title={t("common.exiled_cards")}
                      differences={stats.differences.exileSlots}
                      omitHeadings
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
                        <dt>{formatModifier(modifier as Modifier, t)}</dt>
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

function formatModifier(modifier: Modifier, t: TFunction) {
  return t(`deck_view.discounts.${modifier}`);
}
