import css from "./card-health.module.css";

import { HealthIcon, SanityIcon } from "../ui/icons/health-icons";

type Props = {
  health?: number;
  sanity?: number;
};

export function CardHealth({ health, sanity }: Props) {
  return (
    <div className={css["health"]}>
      <HealthIcon health={health} />
      <SanityIcon sanity={sanity} />
    </div>
  );
}
