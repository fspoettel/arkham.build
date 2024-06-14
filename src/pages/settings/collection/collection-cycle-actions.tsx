import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import css from "./collection.module.css";

type Props = {
  cycleCode: string;
  onToggleCycle: (evt: React.MouseEvent) => void;
};

export function CollectionCycleActions({ cycleCode, onToggleCycle }: Props) {
  return (
    <div className={css["cycle-actions"]}>
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
        className={css["cycle-toggle"]}
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
