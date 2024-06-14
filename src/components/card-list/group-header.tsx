import { Grouping } from "@/store/selectors/utils/grouping";
import css from "./group-header.module.css";
import { LazyEncounterIcon } from "../ui/icons/lazy-icons";

type Props = {
  grouping: Grouping;
};

export function GroupHeader({ grouping }: Props) {
  return (
    <div className={css["group-header"]}>
      {grouping.grouping_type === "encounter_set" && (
        <LazyEncounterIcon code={grouping.code} />
      )}
      <h3>{grouping.name}</h3>
    </div>
  );
}
