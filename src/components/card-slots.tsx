import clsx from "clsx";

import { splitMultiValue } from "@/utils/card-utils";

import css from "./card-slots.module.css";

import SlotIcon from "./icons/slot-icon";

type Props = {
  className?: string;
  slot: string;
  size?: "small" | "default";
};

export function CardSlots(props: Props) {
  return (
    <ol
      className={clsx(
        css["slots"],
        props.size && css[props.size],
        props.className,
      )}
    >
      {splitMultiValue(props.slot).map((slot) => (
        <li key={slot}>
          <SlotIcon code={slot} />
        </li>
      ))}
    </ol>
  );
}
