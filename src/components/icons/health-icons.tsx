import clsx from "clsx";

import css from "./health-icons.module.css";

import { CostIcon } from "./cost-icon";

export function HealthIcon({ health }: { health?: number }) {
  return (
    <div className={css["health"]}>
      <i className={clsx(css["icon-base"], "icon-health")} />
      <CostIcon className={css["icon-cost"]} cost={health} />
    </div>
  );
}

export function SanityIcon({ sanity }: { sanity?: number }) {
  return (
    <div className={css["sanity"]}>
      <i className={clsx(css["icon-base"], "icon-sanity")} />
      <CostIcon className={css["icon-cost"]} cost={sanity} />
    </div>
  );
}
