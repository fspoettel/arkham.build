import type { CardResolved } from "@/store/selectors/card-view";

import css from "./card-details.module.css";

import { CardSlots } from "./card-slots";

type Props = {
  resolvedCard: CardResolved;
};

export function CardDetails({ resolvedCard }: Props) {
  const { card, subtype, type } = resolvedCard;

  const showType = type.code !== "investigator";

  return (
    <div className={css["details"]}>
      <div className={css["details-text"]}>
        {(showType || subtype || card.real_slot) && (
          <p className={css["details-type"]}>
            {showType && <span>{type.name}</span>}
            {subtype && <span>{subtype.name}</span>}
            {card.real_slot && <span>{card.real_slot}</span>}
          </p>
        )}
        {card.real_traits && (
          <p className={css["details-traits"]}>{card.real_traits}</p>
        )}
        {!!card.doom && <p>Doom: {card.doom}</p>}
        {!!card.clues && (
          <p>
            {!!card.shroud && <>Shroud: {card.shroud}, </>}
            Clues: {card.clues}{" "}
            {!card.clues_fixed && (
              <i className="icon-text icon-per_investigator" />
            )}
          </p>
        )}
      </div>
      {card.real_slot && (
        <CardSlots className={css["details-slots"]} slot={card.real_slot} />
      )}
    </div>
  );
}
