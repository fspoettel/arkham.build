/* eslint-disable react/display-name */
import type { ScrollAreaProps } from "@radix-ui/react-scroll-area";
import { Root, Scrollbar, Thumb, Viewport } from "@radix-ui/react-scroll-area";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

import css from "./scroll-area.module.css";

type Props = ScrollAreaProps & {
  children: ReactNode;
};

export const Scroller = forwardRef(
  ({ children, ...rest }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <Root {...rest} className={css["scroll-area-root"]}>
        <Viewport ref={ref} className={css["scroll-area-viewport"]}>
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
