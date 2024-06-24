import { FloatingPortal } from "@floating-ui/react";
import { useCallback } from "react";

import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { CardTooltip } from "@/components/card-tooltip";
import { useRestingTooltip } from "@/components/ui/tooltip";
import type { Card } from "@/store/services/queries.types";
import { FLOATING_PORTAL_ID } from "@/utils/constants";

import css from "./choose-investigator.module.css";

type Props = {
  card: Card;
};

// TODO: This is very similar to what ListCard does, and links in deck notes should do, see if we can extract.
export function SignatureLink({ card }: Props) {
  const tooltip = useRestingTooltip();
  const modalContext = useCardModalContext();

  const openModal = useCallback(() => {
    if (modalContext) {
      modalContext.setOpen({
        code: card.code,
      });
    }
  }, [card.code, modalContext]);

  return (
    <li className={css["signature"]} key={card.code}>
      <button
        ref={tooltip.refs.setReference}
        {...tooltip.referenceProps}
        onClick={openModal}
      >
        {card.real_name}
      </button>
      {tooltip.isMounted && (
        <FloatingPortal id={FLOATING_PORTAL_ID}>
          <div ref={tooltip.refs.setFloating} style={tooltip.floatingStyles}>
            <div style={tooltip.transitionStyles}>
              <CardTooltip code={card.code} />
            </div>
          </div>
        </FloatingPortal>
      )}
    </li>
  );
}
