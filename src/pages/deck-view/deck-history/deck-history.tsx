import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectDeckHistory } from "@/store/selectors/decks";
import { formatXpAvailable } from "@/utils/formatting";

import { CustomizableDiff } from "./customizable-diff";
import css from "./deck-history.module.css";
import { SlotDiff } from "./slot-diff";

type Props = {
  deck: ResolvedDeck;
};

export function DeckHistory(props: Props) {
  const { deck } = props;

  const history = useStore((state) => selectDeckHistory(state, deck.id));
  if (history.length === 0) return null;

  return (
    <section className={css["container"]}>
      <header className={css["header"]}>
        <h2 className={css["title"]}>Deck History</h2>
      </header>
      <ol className={css["entries"]}>
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
                XP earned:{" "}
                {formatXpAvailable(stats.xp, stats.xpAdjustment, stats.xpSpent)}
              </p>
              <div className={css["entry-container"]}>
                {hasChanges && (
                  <>
                    <div className={css["entry-row"]}>
                      {!!stats.differences.slots.length && (
                        <SlotDiff
                          title="Deck changes"
                          differences={stats.differences.slots}
                        />
                      )}
                      {!!stats.differences.extraSlots.length && (
                        <SlotDiff
                          title="Spirit deck changes"
                          differences={stats.differences.extraSlots}
                        />
                      )}
                    </div>
                    <div className={css["entry-row"]}>
                      {!!stats.differences.exileSlots.length && (
                        <SlotDiff
                          title="Exiled cards"
                          differences={stats.differences.exileSlots}
                        />
                      )}
                      {!!stats.differences.customizations.length && (
                        <CustomizableDiff
                          title="Customizations"
                          differences={stats.differences.customizations}
                        />
                      )}
                    </div>
                  </>
                )}
                {!hasChanges && "No changes"}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
