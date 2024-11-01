import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
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
        iconOnly
        type="button"
        variant="bare"
      >
        <PlusIcon />
      </Button>
      <Button
        className={css["cycle-toggle"]}
        data-cycle={props.cycleCode}
        data-val={0}
        onClick={props.onToggleCycle}
        iconOnly
        type="button"
        variant="bare"
      >
        <MinusIcon />
      </Button>
    </div>
  );
}
