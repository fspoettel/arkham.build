import { FloatingPortal } from "@floating-ui/react";

import { FLOATING_PORTAL_ID } from "@/utils/constants";

import { CardTooltip } from "../card-tooltip";
import { useRestingTooltip } from "../ui/tooltip";
import type { Props as ListCardInnerProps } from "./list-card-inner";
import { ListCardInner } from "./list-card-inner";

type Props = {
  tooltip?: React.ReactNode;
} & Omit<ListCardInnerProps, "figureRef" | "referenceProps">;

export function ListCard({ card, tooltip, ...rest }: Props) {
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
