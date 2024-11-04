import { cx } from "@/utils/cx";
import { useMedia } from "@/utils/use-media";
/* eslint-disable react/display-name */
import type { ScrollAreaProps } from "@radix-ui/react-scroll-area";
import { Root, Scrollbar, Thumb, Viewport } from "@radix-ui/react-scroll-area";
import { forwardRef } from "react";
import css from "./scroller.module.css";

type Props = ScrollAreaProps & {
  className?: string;
  children: React.ReactNode;
  scrollerType?: "scroll" | "hover";
  viewportClassName?: string;
};

export const Scroller = forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { children, className, type, viewportClassName, ...rest } = props;

    const touchDevice = useMedia("(hover: none)");

    const scrollerType = touchDevice && type === "hover" ? "auto" : type;

    return (
      <Root
        {...rest}
        className={cx(css["scroller"], className)}
        type={scrollerType ?? "hover"}
      >
        <Viewport
          className={cx(css["viewport"], viewportClassName)}
          ref={ref}
          tabIndex={-1}
        >
          {children}
        </Viewport>
        <Scrollbar className={css["scrollbar"]} orientation="vertical">
          <Thumb className={css["scrollbar-thumb"]} />
        </Scrollbar>
      </Root>
    );
  },
);
