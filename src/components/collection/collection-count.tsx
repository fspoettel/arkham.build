import type { Counts } from "@/store/selectors/collection";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import css from "./collection.module.css";

type Props = {
  counts: Counts;
  type: "cycle" | "pack";
};

export function CollectionCount(props: Props) {
  const { counts, type } = props;
  return (
    <div className={css["collection-counts"]}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={css["collection-count"]}>
            <i className="icon-per_investigator" /> {counts.player}
          </div>
        </TooltipTrigger>
        <TooltipContent>Total number of player cards in {type}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={css["collection-count"]}>
            <i className="icon-auto_fail" /> {counts.encounter}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Total number of encounter cards in {type}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
