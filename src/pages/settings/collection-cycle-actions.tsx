import { Minus, Plus } from "lucide-react";
import type { MouseEventHandler } from "react";

import { Button } from "@/components/ui/button";

import css from "./collection.module.css";

type Props = {
  cycleCode: string;
  onToggleCycle: MouseEventHandler<HTMLButtonElement>;
};

export function CollectionCycleActions({ cycleCode, onToggleCycle }: Props) {
  return (
    <div className={css["collection-cycle-actions"]}>
      <Button
        className={css["collection-cycle-toggle"]}
        data-cycle={cycleCode}
        data-val={1}
        onClick={onToggleCycle}
        size="sm"
        type="button"
        variant="bare"
      >
        <Plus />
      </Button>
      <Button
        className={css["collection-cycle-toggle"]}
        data-cycle={cycleCode}
        data-val={0}
        onClick={onToggleCycle}
        size="sm"
        type="button"
        variant="bare"
      >
        <Minus />
      </Button>
    </div>
  );
}
