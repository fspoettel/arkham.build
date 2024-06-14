import SvgHealth from "@/assets/icons/health.svg?react";
import SvgSanity from "@/assets/icons/sanity.svg?react";
import { range } from "@/utils/range";

import css from "./card-damage.module.css";

type Props = {
  damage?: number;
  horror?: number;
};

export function CardDamage({ damage, horror }: Props) {
  if (!damage && !horror) return null;

  return (
    <div className={css["damage"]}>
      {!!damage &&
        range(0, damage).map((i) => (
          <SvgHealth className="color-health" key={i} />
        ))}
      {!!horror &&
        range(0, horror).map((i) => (
          <SvgSanity className="color-sanity" key={i} />
        ))}
    </div>
  );
}
