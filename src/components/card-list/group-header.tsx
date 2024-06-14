import { EncounterSet } from "@/store/graphql/types";
import { EncounterIcon } from "../ui/encounter-icon";
import css from "./group-header.module.css";

type Props = {
  set: EncounterSet;
};

export function GroupHeader({ set }: Props) {
  return (
    <div className={css["group-header"]}>
      <EncounterIcon code={set.code} />
      <h3>{set.name}</h3>
    </div>
  );
}
