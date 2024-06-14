import type { Grouping } from "@/store/lib/grouping";

import css from "./grouphead.module.css";

import { CardSlots } from "../card/card-slots";
import EncounterIcon from "../icons/encounter-icon";

type Props = {
  grouping: Grouping;
};

export function Grouphead({ grouping }: Props) {
  return (
    <div className={css["grouphead"]}>
      {grouping.grouping_type === "encounter_set" && (
        <EncounterIcon code={grouping.code} />
      )}
      {grouping.grouping_type === "slot" &&
        grouping.code !== "Other" &&
        grouping.code !== "Permanent" && (
          <CardSlots slot={grouping.code} size="small" />
        )}
      <h3>{grouping.name}</h3>
    </div>
  );
}
