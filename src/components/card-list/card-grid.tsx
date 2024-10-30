import type { ListState } from "@/store/selectors/lists";
import type { Metadata } from "@/store/slices/metadata.types";
import { sideways } from "@/utils/card-utils";
import { CardScan } from "../card/card-scan";
import { Grouphead } from "./grouphead";

import css from "./card-grid.module.css";

type Props = {
  data: ListState;
  metadata: Metadata;
};

export function CardGrid(props: Props) {
  const { data, metadata } = props;

  const { cards, groups, groupCounts } = data;

  return (
    <div className={css["grid"]}>
      {groups.map((grouping, i) => {
        const counts = groupCounts[i];

        const offset =
          i > 0
            ? groupCounts.slice(0, i).reduce((acc, count) => acc + count, 0)
            : 0;

        const groupCards = cards.slice(offset, offset + counts);

        return (
          <div className={css["group"]} key={grouping.key}>
            <Grouphead grouping={grouping} metadata={metadata} />
            <div className={css["group-items"]}>
              {groupCards.map((card) => (
                <div className={css["group-item"]} key={card.code}>
                  <CardScan lazy code={card.code} sideways={sideways(card)} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
