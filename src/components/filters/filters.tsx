import { useStore } from "@/store";
import css from "./filters.module.css";
import { selectIsInitialized } from "@/store/selectors";
import { selectActiveCardType } from "@/store/selectors/filters";
import { PlayerCardFilters } from "./player-card-filters";
import { EncounterCardFilters } from "./encounter-card-filters";

export function Filters() {
  const isInitalized = useStore(selectIsInitialized);
  const cardTypeSelection = useStore(selectActiveCardType);
  const resetFilters = useStore((state) => state.resetFilters);

  if (!isInitalized) return null;

  return (
    <nav className={css["filters"]}>
      <div className={css["filter-header"]}>
        <button className="button button-bare" onClick={resetFilters}>
          Reset
        </button>
      </div>
      {cardTypeSelection === "player" ? (
        <PlayerCardFilters />
      ) : (
        <EncounterCardFilters />
      )}
    </nav>
  );
}
