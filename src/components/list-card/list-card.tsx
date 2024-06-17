import { FloatingPortal } from "@floating-ui/react";

import { FLOATING_PORTAL_ID } from "@/utils/constants";

import { CardTooltip } from "../card-tooltip";
import { useRestingTooltip } from "../ui/tooltip";
import type { Props as ListCardInnerProps } from "./list-card-inner";
import { ListCardInner } from "./list-card-inner";

type Props = {
  canOpenModal?: boolean;
  tooltip?: React.ReactNode;
} & Omit<ListCardInnerProps, "onToggleModal" | "figureRef" | "referenceProps">;

export function ListCard({
  canOpenModal = true,
  card,
  tooltip,
  ...rest
}: Props) {
  const { refs, referenceProps, isMounted, floatingStyles, transitionStyles } =
    useRestingTooltip();

  if (!card) return null;

  return (
    <>
      <ListCardInner
        {...rest}
        canOpenModal={canOpenModal}
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
