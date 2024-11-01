import { splitMultiValue } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import css from "./card-slots.module.css";
import SlotIcon from "./icons/slot-icon";

type Props = {
  className?: string;
  slot: string;
  size?: "small" | "default";
};

export function CardSlots(props: Props) {
  const { className, slot, size } = props;
  return (
    <ol className={cx(css["slots"], size && css[size], className)}>
      {splitMultiValue(slot).map((slot) => (
        <li key={slot}>
          <SlotIcon code={slot} />
        </li>
      ))}
    </ol>
  );
}
