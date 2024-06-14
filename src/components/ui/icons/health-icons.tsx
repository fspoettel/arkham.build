import css from "./health-icons.module.css";
import SvgHealth from "@/assets/icons/health.svg?react";
import SvgSanity from "@/assets/icons/sanity.svg?react";
import { CostIcon } from "./cost-icon";

export function HealthIcon({ health }: { health?: number }) {
  return (
    <div className={css["health"]}>
      <SvgHealth className={css["icon-base"]} />
      <CostIcon className={css["icon-cost"]} cost={health} />
    </div>
  );
}

export function SanityIcon({ sanity }: { sanity?: number }) {
  return (
    <div className={css["sanity"]}>
      <SvgSanity className={css["icon-base"]} />
      <CostIcon className={css["icon-cost"]} cost={sanity} />
    </div>
  );
}
