import clsx from "clsx";

import { splitMultiValue } from "@/utils/card-utils";

import css from "./card-slots.module.css";

import { LazySlotIcon } from "../icons/lazy-icons";

type Props = {
  className?: string;
  slot: string;
  size?: "small" | "default";
};

export function CardSlots({ className, slot, size }: Props) {
  return (
    <ol className={clsx(css["slots"], size && css[size], className)}>
      {splitMultiValue(slot).map((slot) => (
        <li key={slot}>
          <LazySlotIcon code={slot} />
        </li>
      ))}
    </ol>
  );
}
