import clsx from "clsx";

import css from "./card-health.module.css";

import { HealthIcon, SanityIcon } from "../icons/health-icons";

type Props = {
  className?: string;
  health?: number;
  sanity?: number;
};

export function CardHealth({ className, health, sanity }: Props) {
  return (
    <div className={clsx(className, css["health"])}>
      <HealthIcon health={health} />
      <SanityIcon sanity={sanity} />
    </div>
  );
}
