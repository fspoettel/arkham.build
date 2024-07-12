import { cx } from "@/utils/cx";
import { useCallback, useEffect, useState } from "react";

import css from "./range-select.module.css";

import type { Props as SliderProps } from "./slider";
import { Slider } from "./slider";

type Props = Omit<SliderProps, "defaultValue"> & {
  className?: string;
  children?: React.ReactNode;
  id: string;
  label: React.ReactNode;
  min: number;
  max: number;
  showLabel?: boolean;
  sliderClassName?: string;
  value: [number, number];
};

export function RangeSelect(props: Props) {
  const {
    className,
    sliderClassName,
    id,
    label,
    min,
    max,
    onValueCommit,
    showLabel,
    value,
    ...rest
  } = props;

  const [liveValue, setLiveValue] = useState(value);

  useEffect(() => {
    setLiveValue(value);
  }, [value]);

  const onValueChange = useCallback((value: number[]) => {
    setLiveValue([value[0], value[1]]);
  }, []);

  return (
    <div className={cx(css["field"], className)}>
      <label className={cx(css["label"], !showLabel && "sr-only")} htmlFor={id}>
        {label}
      </label>
      <Slider
        {...rest}
        className={sliderClassName}
        id={id}
        max={max}
        min={min}
        onLostPointerCapture={() => {
          if (liveValue[0] !== value[0] || liveValue[1] !== value[1]) {
            onValueCommit?.(liveValue);
          }
        }}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        step={1}
        thumbCount={2}
        value={liveValue}
      />
      <div className={css["limits"]}>
        <input
          max={value[1]}
          min={min}
          readOnly
          tabIndex={-1}
          type="text"
          value={liveValue[0]}
        />
        <input
          max={max}
          min={value[0]}
          readOnly
          tabIndex={-1}
          type="text"
          value={liveValue[1]}
        />
      </div>
    </div>
  );
}
