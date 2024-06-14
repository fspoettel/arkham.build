import { Root, Track, Range, SliderProps, Thumb } from "@radix-ui/react-slider";
import clsx from "clsx";
import css from "./slider.module.css";
import { range } from "@/utils/range";

export type Props = SliderProps & {
  className?: string;
  thumbCount?: number;
};

export function Slider({ className, thumbCount = 1, ...rest }: Props) {
  return (
    <Root {...rest} className={clsx(css["slider"], className)}>
      <Track className={clsx(css["slider-track"])}>
        <Range className={clsx(css["slider-range"])} />
      </Track>
      {range(0, thumbCount).map((i) => (
        <Thumb key={i} className={css["slider-thumb"]} />
      ))}
    </Root>
  );
}
