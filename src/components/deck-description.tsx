import { redirectArkhamDBLinks } from "@/utils/arkhamdb";
import { FLOATING_PORTAL_ID } from "@/utils/constants";
import { cx } from "@/utils/cx";
import { parseMarkdown } from "@/utils/markdown";
import {
  FloatingPortal,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from "@floating-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CardTooltip } from "./card-tooltip";
import css from "./deck-description.module.css";

type Props = {
  className?: string;
  content: string;
};

function DeckDescription(props: Props) {
  const { className, content } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardTooltip, setCardTooltip] = useState<string>("");

  const restTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(
    () => () => {
      if (restTimeoutRef.current) clearTimeout(restTimeoutRef.current);
    },
    [],
  );

  const { context, refs, floatingStyles } = useFloating({
    open: !!cardTooltip,
    onOpenChange: () => setCardTooltip(""),
    middleware: [shift(), autoPlacement(), offset(2)],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context);

  const onMouseMove = useCallback(
    (evt: MouseEvent) => {
      const code = getCardCodeForEvent(evt);
      if (code) {
        clearTimeout(restTimeoutRef.current);

        restTimeoutRef.current = setTimeout(() => {
          refs.setReference(evt.target as HTMLAnchorElement);
          setCardTooltip(code);
        }, 25);
      }
    },
    [refs],
  );

  const onMouseLeave = useCallback(
    (evt: MouseEvent) => {
      clearTimeout(restTimeoutRef.current);

      const code = getCardCodeForEvent(evt);
      if (code === cardTooltip || !code) {
        evt.preventDefault();
        setCardTooltip("");
      }
    },
    [cardTooltip],
  );

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    const links = div.querySelectorAll("a");

    for (const link of links) {
      link.addEventListener("pointermove", onMouseMove);
      link.addEventListener("pointerleave", onMouseLeave);
      link.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      for (const link of links) {
        link.removeEventListener("pointermove", onMouseMove);
        link.addEventListener("pointerleave", onMouseLeave);
        link.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [onMouseMove, onMouseLeave]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents:  not relevant.
    <div
      className={css["description"]}
      onClick={redirectArkhamDBLinks}
      ref={containerRef}
    >
      <div
        className={cx("longform", className)}
        data-testid="description-content"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: we sanitize html content.
        dangerouslySetInnerHTML={{
          __html: parseMarkdown(content),
        }}
      />

      {isMounted && cardTooltip && (
        <FloatingPortal id={FLOATING_PORTAL_ID}>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...transitionStyles }}
          >
            <CardTooltip code={cardTooltip} />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

function getCardCodeForEvent(
  evt: React.MouseEvent | MouseEvent,
): string | undefined {
  const target = (evt.target as HTMLElement)?.closest("a");

  if (target instanceof HTMLAnchorElement) {
    return /\/card\/(\d*)$/.exec(target.href)?.[1];
  }
}

export default DeckDescription;
