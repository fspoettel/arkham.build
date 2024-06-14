import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useState } from "react";

import css from "./range-select.module.css";

import { Slider, Props as SliderProps } from "./slider";

type Props = Omit<SliderProps, "defaultValue"> & {
  className?: string;
  children?: ReactNode;
  id: string;
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
  onValueCommit,
  value,
  ...rest
}: Props) {
  const [liveValue, setLiveValue] = useState(value);

  useEffect(() => {
    setLiveValue(value);
  }, [value]);

  const onValueChange = useCallback((value: number[]) => {
    setLiveValue([value[0], value[1]]);
  }, []);

  return (
    <div className={clsx(css["field"], className)}>
      <Slider
        {...rest}
        className={clsx(css["field-input"], sliderClassName)}
        id={id}
        min={min}
        max={max}
        step={1}
        onValueCommit={onValueCommit}
        onValueChange={onValueChange}
        onLostPointerCapture={() => {
          if (liveValue[0] !== value[0] || liveValue[1] !== value[1]) {
            onValueCommit?.(liveValue);
          }
        }}
        thumbCount={2}
        value={liveValue}
      />
      <div className={css["field-limits"]}>
        <input
          min={min}
          max={value[1]}
          type="text"
          readOnly
          value={liveValue[0]}
          tabIndex={-1}
        />
        <input
          min={value[0]}
          max={max}
          type="text"
          readOnly
          value={liveValue[1]}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}