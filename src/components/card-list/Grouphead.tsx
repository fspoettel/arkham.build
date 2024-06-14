import { Grouping } from "@/store/utils/grouping";

import css from "./grouphead.module.css";

import { CardSlots } from "../card/card-slots";
import { LazyEncounterIcon } from "../icons/lazy-icons";

type Props = {
  grouping: Grouping;
};

export function Grouphead({ grouping }: Props) {
  return (
    <div className={css["grouphead"]}>
      {grouping.grouping_type === "encounter_set" && (
        <LazyEncounterIcon code={grouping.code} />
      )}
      {grouping.grouping_type === "slot" &&
        grouping.code !== "Slotless" &&
        grouping.code !== "Permanent" && (
          <CardSlots slot={grouping.code} size="small" />
        )}
      <h3>{grouping.name}</h3>
    </div>
  );
}
