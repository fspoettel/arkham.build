import type { ResolvedDeck } from "@/store/lib/types";
import css from "./deck-stats.module.css";
import { DefaultTooltip } from "./ui/tooltip";

type Props = {
  deck: ResolvedDeck;
};

export function DeckStats(props: Props) {
  const { deck } = props;

  return (
    <div className={css["stats"]}>
      <DefaultTooltip tooltip="Amount of XP required to build this deck from scratch.">
        <strong data-testid="deck-summary-xp">
          <i className="icon-xp-bold" />
          {deck.stats.xpRequired} XP
        </strong>
      </DefaultTooltip>
      {!!deck.xp && (
        <DefaultTooltip tooltip="XP available to spend after latest upgrade.">
          <strong data-testid="deck-xp-earned">
            <i className="icon-upgrade" />
            {deck.xp + (deck.xp_adjustment ?? 0)} XP
          </strong>
        </DefaultTooltip>
      )}
      <DefaultTooltip tooltip="Deck size">
        <strong data-testid="deck-summary-size">
          <i className="icon-card-outline-bold" />× {deck.stats.deckSize} (
          {deck.stats.deckSizeTotal})
        </strong>
      </DefaultTooltip>
    </div>
  );
}
