import type { SlotUpgrade } from "@/store/selectors/decks";

import { ListCard } from "@/components/list-card/list-card";
import { cx } from "@/utils/cx";
import css from "./diffs.module.css";

export function SlotDiff(props: {
  differences: SlotUpgrade[];
  size?: "sm";
  title: React.ReactNode;
}) {
  const { differences, size, title } = props;

  if (!differences.length) return null;

  return (
    <article className={cx(css["diffs-container"], size && css[size])}>
      <header>
        <h4 className={css["diffs-title"]}>{title}</h4>
      </header>
      <ol className={css["diffs"]}>
        {differences.map((change, idx) => (
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
              omitThumbnail={size === "sm"}
              size={size === "sm" ? "xs" : "sm"}
            />
          </li>
        ))}
      </ol>
    </article>
  );
}
