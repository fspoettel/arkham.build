import { CardTypeFilter } from "../card-type-filter";

import css from "./card-search.module.css";

export function CardSearch() {
  return (
    <search className={css["card-search"]} title="Card search">
      <input
        className={css["card-search-input"]}
        type="search"
        id="card-search"
        placeholder="Search for cards..."
      />
      <CardTypeFilter className={css["card-search-toggle"]} />
    </search>
  );
}
