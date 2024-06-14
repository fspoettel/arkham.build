import { Grouping } from "@/store/selectors/utils/grouping";
import { EncounterIcon } from "../ui/encounter-icon";
import css from "./group-header.module.css";

type Props = {
  grouping: Grouping;
};

export function GroupHeader({ grouping }: Props) {
  return (
    <div className={css["group-header"]}>
      {grouping.grouping_type === "encounter_set" && (
        <EncounterIcon code={grouping.code} />
      )}
      <h3>{grouping.name}</h3>
    </div>
  );
}
