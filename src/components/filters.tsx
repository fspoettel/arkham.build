import { SelectFaction } from "./select-faction";

import css from "./filters.module.css";
import { SelectLevel } from "./select-level";
import { SelectCost } from "./select-cost";
import { useStore } from "@/store";

export function Filters() {
  const initialized = useStore((state) => !!state.dataVersion);
  if (!initialized) return null;

  return (
    <div className={css["filters"]}>
      <SelectFaction />
      <SelectLevel />
      <SelectCost />
    </div>
  );
}
