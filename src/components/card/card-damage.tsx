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
          <i className="icon-health color-health" key={i} />
        ))}
      {!!horror &&
        range(0, horror).map((i) => (
          <i className="icon-sanity color-sanity" key={i} />
        ))}
    </div>
  );
}
