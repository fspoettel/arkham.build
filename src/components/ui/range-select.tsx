import { Props as SliderProps, Slider } from "./slider";
import css from "./range-select.module.css";
import clsx from "clsx";

type Props = Omit<SliderProps, "defaultValue"> & {
  className?: string;
  id: string;
  label: string;
  min: number;
  max: number;
  sliderClassName?: string;
  value: [number, number];
};

export function RangeSelect({
  className,
  sliderClassName,
  id,
  min,
  max,
  label,
  onValueChange,
  value,
  ...rest
}: Props) {
  return (
    <div className={clsx(css["field"], className)}>
      <label className={css["field-label"]} htmlFor={id}>
        {label}
      </label>
      <Slider
        {...rest}
        className={clsx(css["field-input"], sliderClassName)}
        id={id}
        min={min}
        max={max}
        step={1}
        onValueChange={onValueChange}
        thumbCount={2}
        value={value}
      />
      <div className={css["field-limits"]}>
        <input min={min} max={value[1]} type="text" readOnly value={value[0]} />
        <input min={value[0]} max={max} type="text" readOnly value={value[1]} />
      </div>
    </div>
  );
}
