import { FloatingPortal } from "@floating-ui/react";

import { FLOATING_PORTAL_ID } from "@/utils/constants";

import { CardTooltip } from "../card-tooltip";
import { useRestingTooltip } from "../ui/tooltip.hooks";
import type { Props as ListCardInnerProps } from "./list-card-inner";
import { ListCardInner } from "./list-card-inner";

export type Props = {
  tooltip?: React.ReactNode;
} & Omit<ListCardInnerProps, "figureRef" | "referenceProps">;

export function ListCard(props: Props) {
  const { card, tooltip, ...rest } = props;
  const { refs, referenceProps, isMounted, floatingStyles, transitionStyles } =
    useRestingTooltip();

  if (!card) return null;

  return (
    <>
      <ListCardInner
        {...rest}
        card={card}
        figureRef={refs.setReference}
        referenceProps={referenceProps}
      />
      {isMounted && (
        <FloatingPortal id={FLOATING_PORTAL_ID}>
          <div ref={refs.setFloating} style={floatingStyles}>
            <div style={transitionStyles}>
              {tooltip ?? <CardTooltip code={card.code} />}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
