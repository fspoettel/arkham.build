import type { ListState } from "@/store/selectors/lists";
import css from "./card-list-count.module.css";

export function CardlistCount(props: {
  data: ListState | undefined;
}) {
  const { data } = props;

  const filteredCount = data ? data.totalCardCount - data.cards.length : 0;

  return (
    <span className={css["cardlist-count"]}>
      <span data-testid="cardlist-count">{data?.cards.length ?? 0} cards</span>
      <small>
        <em>{filteredCount > 0 && ` (${filteredCount} hidden by filters)`}</em>
      </small>
    </span>
  );
}
