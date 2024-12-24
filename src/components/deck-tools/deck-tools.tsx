import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Fragment, Suspense, forwardRef, lazy } from "react";
import { Loader } from "../ui/loader";
import { Scroller } from "../ui/scroller";
import { AttachableCards } from "./attachable-cards";
import css from "./deck-tools.module.css";
import { LimitedSlots } from "./limited-slots";

type Props = {
  deck: ResolvedDeck;
  readonly?: boolean;
  scrollable?: boolean;
  showTitle?: boolean;
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
};

const LazyChartContainer = lazy(() => import("./chart-container"));

export const DeckTools = forwardRef(function DeckTools(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { deck, readonly, scrollable, showTitle, slotLeft, slotRight } = props;

  const node = (
    <article className={cx(css["deck-tools"])} ref={ref}>
      <header className={css["tools-header"]}>
        {slotLeft}
        {showTitle && <h3 className={css["tools-title"]}>Deck Tools</h3>}
        {slotRight}
      </header>
      <Suspense fallback={<Loader show message="Loading tools..." />}>
        <LimitedSlots deck={deck} />
        <LazyChartContainer deck={deck} />
        {deck.availableAttachments?.map((attachment) => (
          <Fragment key={attachment.code}>
            {deck.cards.slots[attachment.code]?.card && (
              <AttachableCards
                card={deck.cards.slots[attachment.code]?.card}
                definition={attachment}
                readonly={readonly}
                resolvedDeck={deck}
              />
            )}
            {deck.investigatorBack.card.code === attachment.code && (
              <AttachableCards
                card={deck.investigatorBack.card}
                definition={attachment}
                readonly={readonly}
                resolvedDeck={deck}
              />
            )}
          </Fragment>
        ))}
      </Suspense>
    </article>
  );

  return scrollable ? (
    <Scroller className={css["scroller"]}>{node}</Scroller>
  ) : (
    node
  );
});
