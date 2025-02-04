import type { ResolvedDeck } from "@/store/lib/types";
import { useTranslation } from "react-i18next";
import css from "./deck-stats.module.css";
import { DefaultTooltip } from "./ui/tooltip";

type Props = {
  deck: ResolvedDeck;
};

export function DeckStats(props: Props) {
  const { deck } = props;
  const { t } = useTranslation();

  return (
    <div className={css["stats"]}>
      <DefaultTooltip tooltip={t("common.deck_stats.xp_required_help")}>
        <strong data-testid="deck-summary-xp">
          <i className="icon-xp-bold" />
          {deck.stats.xpRequired} {t("common.xp")}
        </strong>
      </DefaultTooltip>
      {!!deck.xp && (
        <DefaultTooltip tooltip={t("common.deck_stats.xp_available_help")}>
          <strong data-testid="deck-xp-earned">
            <i className="icon-upgrade" />
            {deck.xp + (deck.xp_adjustment ?? 0)} {t("common.xp")}
          </strong>
        </DefaultTooltip>
      )}
      <DefaultTooltip tooltip={t("common.deck_stats.deck_size")}>
        <strong data-testid="deck-summary-size">
          <i className="icon-card-outline-bold" />× {deck.stats.deckSize} (
          {deck.stats.deckSizeTotal})
        </strong>
      </DefaultTooltip>
    </div>
  );
}
