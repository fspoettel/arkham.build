import type { Card } from "@/store/services/queries.types";
import { capitalize } from "@/utils/formatting";
import { CardSlots } from "../card-slots";
import css from "./card.module.css";

type Props = {
  card: Card;
  omitSlotIcon?: boolean;
};

export function CardDetails(props: Props) {
  const { card, omitSlotIcon } = props;

  const showType = card.type_code !== "investigator";

  return (
    <div className={css["details"]}>
      <div className={css["details-text"]}>
        {(showType || !!card.subtype_code || card.real_slot) && (
          <p className={css["details-type"]}>
            {showType && <span>{capitalize(card.type_code)}</span>}
            {card.subtype_code && <span>{capitalize(card.subtype_code)}</span>}
            {card.real_slot && <span>{card.real_slot}</span>}
          </p>
        )}
        {card.real_traits && (
          <p className={css["details-traits"]}>{card.real_traits}</p>
        )}
        {!!card.doom && <p>Doom: {card.doom}</p>}
        {card.type_code === "location" && (
          <p>
            Shroud:{" "}
            {card.shroud != null ? card.shroud : <i className="icon-numNull" />}
            , Clues: {card.clues}
            {!!card.clues && !card.clues_fixed && (
              <>
                {" "}
                <i className="icon-text icon-per_investigator" />
              </>
            )}
          </p>
        )}
      </div>
      {!omitSlotIcon && card.real_slot && (
        <CardSlots className={css["details-slots"]} slot={card.real_slot} />
      )}
    </div>
  );
}
