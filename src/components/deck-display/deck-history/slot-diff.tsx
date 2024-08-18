import type { SlotUpgrade } from "@/store/selectors/decks";

import { ListCard } from "@/components/list-card/list-card";
import { cx } from "@/utils/cx";
import css from "./deck-history.module.css";

export function SlotDiff(props: {
  title: React.ReactNode;
  differences: SlotUpgrade[];
}) {
  return (
    <article className={css["diffs-container"]}>
      <header>
        <h4 className={css["diffs-title"]}>{props.title}</h4>
      </header>
      <ol className={css["diffs"]}>
        {props.differences.map((change, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: no natural key available.
          <li className={css["diff"]} key={idx}>
            <span
              className={cx(
                css["diff-quantity"],
                change.diff > 0 ? css["positive"] : css["negative"],
              )}
            >
              {change.diff > 0 ? "+" : "–"}
              {Math.abs(change.diff)}
            </span>
            <ListCard
              key={change.card.code}
              card={change.card}
              omitBorders
              size="sm"
            />
          </li>
        ))}
      </ol>
    </article>
  );
}
