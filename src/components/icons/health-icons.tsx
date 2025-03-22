import { cx } from "@/utils/cx";
import { CostIcon } from "./cost-icon";
import css from "./health-icons.module.css";

export function HealthIcon({ health }: { health?: number | null }) {
  return (
    <div className={css["health"]} data-testid="health" data-value={health}>
      <i className={cx(css["icon-base"], "icon-health")} />
      <CostIcon className={css["icon-cost"]} cost={health} />
    </div>
  );
}

export function SanityIcon({ sanity }: { sanity?: number | null }) {
  return (
    <div className={css["sanity"]} data-testid="sanity" data-value={sanity}>
      <i className={cx(css["icon-base"], "icon-sanity")} />
      <CostIcon className={css["icon-cost"]} cost={sanity} />
    </div>
  );
}
