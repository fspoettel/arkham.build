import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import css from "./collection.module.css";

type Props = {
  cycleCode: string;
  onToggleCycle: (evt: React.MouseEvent) => void;
};

export function CollectionCycleActions(props: Props) {
  return (
    <div className={css["cycle-actions"]}>
      <Button
        className={css["collection-cycle-toggle"]}
        data-cycle={props.cycleCode}
        data-val={1}
        onClick={props.onToggleCycle}
        size="sm"
        type="button"
        variant="bare"
      >
        <Plus />
      </Button>
      <Button
        className={css["cycle-toggle"]}
        data-cycle={props.cycleCode}
        data-val={0}
        onClick={props.onToggleCycle}
        size="sm"
        type="button"
        variant="bare"
      >
        <Minus />
      </Button>
    </div>
  );
}
