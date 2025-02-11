import type { ListState } from "@/store/selectors/lists";
import { useTranslation } from "react-i18next";
import css from "./card-list-count.module.css";

export function CardlistCount(props: {
  data: ListState | undefined;
}) {
  const { data } = props;
  const { t } = useTranslation();

  const filteredCount = data ? data.totalCardCount - data.cards.length : 0;

  const count = data?.cards.length ?? 0;

  return (
    <span className={css["cardlist-count"]}>
      <span data-testid="cardlist-count">
        {t("lists.nav.card_count", { count })}
      </span>
      {filteredCount > 0 && (
        <small>
          <em> {t("lists.nav.card_count_hidden", { count: filteredCount })}</em>
        </small>
      )}
    </span>
  );
}
