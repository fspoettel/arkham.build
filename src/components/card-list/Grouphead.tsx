import { Grouping } from "@/store/selectors/utils/grouping";

import css from "./grouphead.module.css";

import { LazyEncounterIcon } from "../ui/icons/lazy-icons";

type Props = {
  grouping: Grouping;
};

export function Grouphead({ grouping }: Props) {
  return (
    <div className={css["grouphead"]}>
      {grouping.grouping_type === "encounter_set" && (
        <LazyEncounterIcon code={grouping.code} />
      )}
      <h3>{grouping.name}</h3>
    </div>
  );
}
