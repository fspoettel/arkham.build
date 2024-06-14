import { SubType, Type } from "@/store/graphql/types";

import css from "./card-details.module.css";

import { CardSlots } from "./card-slots";

type Props = {
  slot?: string;
  subtype?: SubType;
  traits?: string;
  type?: Type;
  doom?: number;
  clues?: number;
  cluesFixed?: boolean;
  shroud?: number;
};

export function CardDetails({
  clues,
  cluesFixed,
  doom,
  slot,
  traits,
  subtype,
  type,
  shroud,
}: Props) {
  const showType = type && type.code !== "investigator";

  return (
    <div className={css["details"]}>
      <div className={css["details-text"]}>
        {(showType || subtype || slot) && (
          <p className={css["details-type"]}>
            {showType && <span>{type.name}</span>}
            {subtype && <span>{subtype.name}</span>}
            {slot && <span>{slot}</span>}
          </p>
        )}
        {traits && <p className={css["details-traits"]}>{traits}</p>}
        {!!doom && <p>Doom: {doom}</p>}
        {!!clues && (
          <p>
            {!!shroud && <>Shroud: {shroud}, </>}
            Clues: {clues}{" "}
            {!cluesFixed && <i className="icon-text icon-per_investigator" />}
          </p>
        )}
      </div>
      {slot && <CardSlots className={css["details-slots"]} slot={slot} />}
    </div>
  );
}
