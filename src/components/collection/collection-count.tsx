import type { Counts } from "@/store/selectors/collection";
import { DefaultTooltip } from "../ui/tooltip";
import css from "./collection.module.css";

type Props = {
  counts?: Counts;
  type: "cycle" | "pack";
};

export function CollectionCount(props: Props) {
  const { counts, type } = props;

  if (!counts) return null;

  return (
    <div className={css["collection-counts"]}>
      <DefaultTooltip tooltip={`Total number of player cards in ${type}`}>
        <div className={css["collection-count"]}>
          <i className="icon-per_investigator" /> {counts.player}
        </div>
      </DefaultTooltip>
      <DefaultTooltip tooltip={`Total number of encounter cards in ${type}`}>
        <div className={css["collection-count"]}>
          <i className="icon-auto_fail" /> {counts.encounter}
        </div>
      </DefaultTooltip>
    </div>
  );
}
