import clsx from "clsx";

import { LazyPackIcon } from "@/components/icons/lazy-icons";
import { Checkbox } from "@/components/ui/checkbox";
import type { Cycle, Pack } from "@/store/services/types";

import css from "./collection.module.css";

type Props = {
  cycle: Cycle;
  hasQuantity: boolean;
  pack: Pack;
  value: number;
  onChange: (code: string, val: number) => void;
};

export function CollectionPack({
  cycle,
  hasQuantity,
  pack,
  onChange,
  value,
}: Props) {
  return (
    <li
      className={clsx(css["collection-pack"], pack.reprint && css["reprint"])}
      key={pack.code}
    >
      {hasQuantity ? (
        <div className={css["collection-pack-label"]}>
          <input
            className={css["collection-quantity-input"]}
            min={0}
            max={2}
            onChange={(evt) => {
              const val = Number.parseInt(evt.target.value, 10);
              if (!Number.isNaN(val)) onChange(pack.code, val);
            }}
            name={pack.code}
            type="number"
            value={value}
            id={`collection-${cycle.code}-${pack.code}`}
          />
          <LazyPackIcon code={pack.code} />
          <label htmlFor={`collection-${cycle.code}-${pack.code}`}>
            {pack.real_name}
          </label>
        </div>
      ) : (
        <Checkbox
          label={
            <div className={css["collection-pack-label"]}>
              <LazyPackIcon code={pack.code} />
              {pack.real_name}
            </div>
          }
          data-pack={pack.code}
          onCheckedChange={(checked) => onChange(pack.code, checked ? 1 : 0)}
          checked={!!value}
          name={pack.code}
          id={`collection-${cycle.code}-${pack.code}`}
        />
      )}
    </li>
  );
}
