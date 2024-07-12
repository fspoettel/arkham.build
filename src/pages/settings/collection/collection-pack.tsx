import clsx from "clsx";

import PackIcon from "@/components/icons/pack-icon";
import { Checkbox } from "@/components/ui/checkbox";
import type { Cycle, Pack } from "@/store/services/queries.types";

import css from "./collection.module.css";

type Props = {
  cycle: Cycle;
  hasQuantity: boolean;
  pack: Pack;
  value: number;
  onChange: (code: string, val: number) => void;
};

export function CollectionPack(props: Props) {
  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target instanceof HTMLInputElement) {
      const val = Number.parseInt(evt.target.value, 10);
      if (!Number.isNaN(val)) props.onChange(props.pack.code, val);
    }
  };

  return (
    <li
      className={clsx(css["pack"], props.pack.reprint && css["reprint"])}
      key={props.pack.code}
    >
      {props.hasQuantity ? (
        <div className={css["pack-name"]}>
          <input
            className={css["pack-quantity-input"]}
            id={`collection-${props.cycle.code}-${props.pack.code}`}
            max={2}
            min={0}
            name={props.pack.code}
            onChange={onInputChange}
            type="number"
            value={props.value}
          />
          <PackIcon code={props.pack.code} />
          <label
            className={css["pack-label"]}
            htmlFor={`collection-${props.cycle.code}-${props.pack.code}`}
          >
            {props.pack.real_name}
          </label>
        </div>
      ) : (
        <Checkbox
          checked={!!props.value}
          data-pack={props.pack.code}
          id={`collection-${props.cycle.code}-${props.pack.code}`}
          label={
            <div className={css["pack-name"]}>
              <PackIcon code={props.pack.code} />
              {props.pack.real_name}
            </div>
          }
          name={props.pack.code}
          onCheckedChange={(checked) =>
            props.onChange(props.pack.code, checked ? 1 : 0)
          }
        />
      )}
    </li>
  );
}
