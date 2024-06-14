import {
  FloatingPortal,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import clsx from "clsx";
import DOMPurify from "dompurify";
import { marked } from "marked";
import type React from "react";
import { useCallback, useState } from "react";

import css from "./deck-description.module.css";

import { CardTooltip } from "./card-tooltip/card-tooltip";

type Props = {
  className?: string;
  content: string;
  title: React.ReactNode;
};

function getCardCodeForEvent(evt: React.MouseEvent): string | undefined {
  const target = (evt.target as HTMLElement)?.closest("a");

  if (target instanceof HTMLAnchorElement) {
    return /\/card\/(\d*)$/.exec(target.href)?.[1];
  }
}

export function DeckDescription({ className, content, title }: Props) {
  const [cardTooltip, setCardTooltip] = useState<string>("");

  const { refs, floatingStyles } = useFloating({
    open: !!cardTooltip,
    onOpenChange: () => setCardTooltip(""),
    middleware: [shift(), autoPlacement(), offset(2)],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
  });

  const handleMouseLeave = useCallback(
    (evt: React.MouseEvent) => {
      const code = getCardCodeForEvent(evt);

      if (code && code !== cardTooltip) {
        evt.preventDefault();
        refs.setReference(evt.target as HTMLAnchorElement);
        setCardTooltip(code);
      } else if (cardTooltip) {
        evt.preventDefault();
        setCardTooltip("");
      }
    },
    [cardTooltip, refs],
  );

  return (
    <div className={css["deck-description"]}>
      <h1>{title}</h1>
      <div
        className={clsx("longform", className)}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked.parse(content) as string),
        }}
        onClick={handleMouseLeave}
      />

      {cardTooltip && (
        <FloatingPortal id="floating">
          <div ref={refs.setFloating} style={floatingStyles}>
            <CardTooltip code={cardTooltip} />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
