/* eslint-disable react/display-name */
import type { ScrollAreaProps } from "@radix-ui/react-scroll-area";
import { Root, Scrollbar, Thumb, Viewport } from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

import css from "./scroller.module.css";

type Props = ScrollAreaProps & {
  className?: string;
  children: ReactNode;
  viewportClassName?: string;
};

export const Scroller = forwardRef(
  (
    { children, className, viewportClassName, ...rest }: Props,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <Root
        {...rest}
        className={clsx(css["scroll-area-root"], className)}
        type="scroll"
      >
        <Viewport
          className={clsx(css["scroll-area-viewport"], viewportClassName)}
          ref={ref}
          tabIndex={-1}
        >
          {children}
        </Viewport>
        <Scrollbar
          className={css["scroll-area-scrollbar"]}
          orientation="vertical"
        >
          <Thumb className={css["scroll-area-thumb"]} />
        </Scrollbar>
      </Root>
    );
  },
);
