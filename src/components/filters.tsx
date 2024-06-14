import { FactionToggle } from "./ui/faction-toggle";

import css from "./filter.module.css";
import { LevelToggle } from "./ui/level-toggle";

export function Filters() {
  return (
    <nav className={css["filters"]}>
      <FactionToggle />
      <LevelToggle />
    </nav>
  );
}
