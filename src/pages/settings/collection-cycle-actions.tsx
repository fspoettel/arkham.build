import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
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
        type="button"
        size="sm"
        data-cycle={cycleCode}
        data-val={1}
        onClick={onToggleCycle}
        variant="bare"
      >
        <PlusIcon />
      </Button>
      <Button
        className={css["collection-cycle-toggle"]}
        type="button"
        size="sm"
        data-cycle={cycleCode}
        data-val={0}
        onClick={onToggleCycle}
        variant="bare"
      >
        <MinusIcon />
      </Button>
    </div>
  );
}
