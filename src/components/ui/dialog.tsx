import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useMergeRefs,
  useTransitionStyles,
} from "@floating-ui/react";
import { cloneElement, forwardRef, isValidElement } from "react";

import { FLOATING_PORTAL_ID } from "@/utils/constants";

import type { DialogOptions } from "./dialog.hooks";
import { DialogContext, useDialog, useDialogContext } from "./dialog.hooks";

export function Dialog({
  children,
  ...options
}: {
  children: React.ReactNode;
} & DialogOptions) {
  const dialog = useDialog(options);
  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & DialogTriggerProps
>(function DialogTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useDialogContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children as React.ReactElement).props,
        "data-state": context.open ? "open" : "closed",
      } as React.HTMLProps<Element>),
    );
  }

  return (
    <div
      data-state={context.open ? "open" : "closed"}
      ref={ref}
      {...context.getReferenceProps(props as React.HTMLProps<Element>)}
    >
      {children}
    </div>
  );
});

export const DialogContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLElement>
>(function DialogContent(props, propRef) {
  const { context: floatingContext, ...context } = useDialogContext();
  const { isMounted, styles } = useTransitionStyles(floatingContext);
  const ref = useMergeRefs([
    context.refs.setFloating,
    propRef,
  ] as React.Ref<HTMLDivElement>[]);

  if (!isMounted) return null;

  return (
    <FloatingPortal id={FLOATING_PORTAL_ID}>
      <FloatingOverlay lockScroll>
        <FloatingFocusManager context={floatingContext}>
          <div
            {...context.getFloatingProps(props)}
            aria-describedby={context.descriptionId}
            aria-labelledby={context.labelId}
            ref={ref}
          >
            <div style={styles}>{props.children}</div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
});

/**
 * This exists to allow modals that persist their scroll position when closed. (i.e. deck notes).
 */
export const DialogContentInert = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLElement>
>(function DialogContent(props, propRef) {
  const { context: floatingContext, ...context } = useDialogContext();
  const { isMounted, styles } = useTransitionStyles(floatingContext);

  const ref = useMergeRefs([
    context.refs.setFloating,
    propRef,
  ] as React.Ref<HTMLDivElement>[]);

  return (
    <FloatingPortal id={FLOATING_PORTAL_ID}>
      <FloatingOverlay
        lockScroll={isMounted}
        style={{ display: floatingContext.open ? "block" : "none" }}
      >
        <div
          aria-describedby={context.descriptionId}
          aria-labelledby={context.labelId}
          ref={ref}
          {...context.getFloatingProps(props)}
        >
          <div style={styles}>{props.children}</div>
        </div>
      </FloatingOverlay>
    </FloatingPortal>
  );
});
