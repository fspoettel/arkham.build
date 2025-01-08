import type { ResolvedDeck } from "@/store/lib/types";
import type { History } from "@/store/selectors/decks";
import { formatXpAvailable } from "@/utils/formatting";
import { CustomizableDiff } from "./customizable-diff";
import css from "./deck-history.module.css";
import { SlotDiff } from "./slot-diff";

type Props = {
  deck: ResolvedDeck;
  history: History;
};

export function DeckHistory(props: Props) {
  const { deck, history } = props;

  return (
    <ol className={css["entries"]} data-testid="history">
      {history.map((stats, idx) => {
        const hasChanges =
          !!stats.differences.slots.length ||
          !!stats.differences.extraSlots.length ||
          !!stats.differences.customizations.length ||
          !!stats.differences.exileSlots.length;

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: no natural key available.
          <li className={css["entry"]} key={idx}>
            <h3 className={css["entry-title"]}>
              {idx === 0
                ? "Current upgrade"
                : `Upgrade #${history.length - idx}`}
            </h3>
            <p className={css["entry-stats"]}>
              XP available:{" "}
              {formatXpAvailable(stats.xp, stats.xpAdjustment, stats.xpSpent)}
            </p>
            <div className={css["entry-container"]}>
              {hasChanges && (
                <>
                  <div className={css["entry-row"]}>
                    <SlotDiff
                      deck={deck}
                      title="Deck changes"
                      differences={stats.differences.slots}
                    />
                    <SlotDiff
                      deck={deck}
                      title="Spirit deck changes"
                      differences={stats.differences.extraSlots}
                    />
                  </div>
                  <div className={css["entry-row"]}>
                    <SlotDiff
                      deck={deck}
                      title="Exiled cards"
                      differences={stats.differences.exileSlots}
                    />
                    <CustomizableDiff
                      deck={deck}
                      title="Customizations"
                      differences={stats.differences.customizations}
                    />
                  </div>
                </>
              )}
              {!hasChanges && "No changes"}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
