import { PlayerCardToggle } from "../player-card-toggle";

import css from "./card-search.module.css";

export function CardSearch() {
  return (
    <div className={css["card-search"]}>
      <input
        className={css["card-search-input"]}
        type="search"
        id="card-search"
        placeholder="Search for cards..."
      />
      <PlayerCardToggle className={css["card-search-toggle"]} />
    </div>
  );
}
