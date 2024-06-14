import clsx from "clsx";

import { splitMultiValue } from "@/utils/card-utils";

import css from "./card-slots.module.css";

import { LazySlotIcon } from "../ui/icons/lazy-icons";

type Props = {
  className?: string;
  slot: string;
};

export function CardSlots({ className, slot }: Props) {
  return (
    <ol className={clsx(css["slots"], className)}>
      {splitMultiValue(slot).map((slot) => (
        <li key={slot}>
          <LazySlotIcon code={slot} />
        </li>
      ))}
    </ol>
  );
}
