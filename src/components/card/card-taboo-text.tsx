import type { Card } from "@/store/services/queries.types";
import { cx } from "@/utils/cx";

import css from "./card.module.css";

type Props = {
  card: Card;
};

export function CardTabooText(props: Props) {
  const { real_taboo_text_change, taboo_xp } = props.card;

  if (!real_taboo_text_change && taboo_xp == null) return null;

  return (
    <div className={cx("border-taboo", css["text"])} data-testid="card-taboo">
      {!!real_taboo_text_change && (
        <p>
          <i className="icon-tablet color-taboo icon-text" /> Taboo List <br />
          Mutated
        </p>
      )}
      {taboo_xp != null && (
        <p>
          <i className="icon-tablet color-taboo icon-text" /> Costs {taboo_xp}
          {taboo_xp > 0 ? " additional" : ""} experience.
        </p>
      )}
    </div>
  );
}
