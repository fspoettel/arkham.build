import { useStore } from "@/store";
import { FactionFilter } from "./faction-filter";

import { LevelFilter } from "./level-filter";
import { CostFilter } from "./cost-filter";

import css from "./filters.module.css";
import { PropertiesFilter } from "./properties-filter";

export function Filters() {
  const initialized = useStore((state) => !!state.dataVersion);
  if (!initialized) return null;

  return (
    <div className={css["filters"]}>
      <FactionFilter />
      <LevelFilter />
      <CostFilter />
      <PropertiesFilter />
    </div>
  );
}
