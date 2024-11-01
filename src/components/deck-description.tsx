import { redirectArkhamDBLinks } from "@/utils/arkhamdb-links";
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
} from "@floating-ui/react";
import { useCallback, useState } from "react";
import { CardTooltip } from "./card-tooltip";
import css from "./deck-description.module.css";

type Props = {
  className?: string;
  content: string;
  title: React.ReactNode;
};

function DeckDescription(props: Props) {
  const { className, content, title } = props;
  const [cardTooltip, setCardTooltip] = useState<string>("");

  const { refs, floatingStyles } = useFloating({
    open: !!cardTooltip,
    onOpenChange: () => setCardTooltip(""),
    middleware: [shift(), autoPlacement(), offset(2)],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
  });

  const onMouseLeave = useCallback(
    (evt: React.MouseEvent) => {
      const code = getCardCodeForEvent(evt);

      if (code && code !== cardTooltip) {
        evt.preventDefault();
        evt.stopPropagation();
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
    // biome-ignore lint/a11y/useKeyWithClickEvents:  not relevant.
    <div className={css["description"]} onClick={redirectArkhamDBLinks}>
      <h1>{title}</h1>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: TODO. */}
      <div
        className={cx("longform", className)}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: we sanitize html content.
        dangerouslySetInnerHTML={{
          __html: parseMarkdown(content),
        }}
        onClick={onMouseLeave}
      />

      {cardTooltip && (
        <FloatingPortal id={FLOATING_PORTAL_ID}>
          <div ref={refs.setFloating} style={floatingStyles}>
            <CardTooltip code={cardTooltip} />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

function getCardCodeForEvent(evt: React.MouseEvent): string | undefined {
  const target = (evt.target as HTMLElement)?.closest("a");

  if (target instanceof HTMLAnchorElement) {
    return /\/card\/(\d*)$/.exec(target.href)?.[1];
  }
}

export default DeckDescription;
