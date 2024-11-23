import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Fragment, Suspense, lazy } from "react";
import { Loader } from "../ui/loader";
import { Scroller } from "../ui/scroller";
import { AttachableCards } from "./attachable-cards";
import css from "./deck-tools.module.css";
import { LimitedSlots } from "./limited-slots";

type Props = {
  deck: ResolvedDeck;
  showTitle?: boolean;
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
};

const LazyChartContainer = lazy(() => import("./chart-container"));

export function DeckTools(props: Props) {
  const { deck, showTitle, slotLeft, slotRight } = props;

  return (
    <Scroller>
      <article className={cx(css["deck-tools"])}>
        <header className={css["tools-header"]}>
          {slotLeft}
          {showTitle && <h3 className={css["tools-title"]}>Deck Tools</h3>}
          {slotRight}
        </header>
        <Suspense fallback={<Loader show message="Loading tools..." />}>
          <LazyChartContainer deck={deck} />
          <LimitedSlots deck={deck} />
          {deck.availableAttachments?.map((attachment) => (
            <Fragment key={attachment.code}>
              {deck.cards.slots[attachment.code]?.card && (
                <AttachableCards
                  card={deck.cards.slots[attachment.code]?.card}
                  definition={attachment}
                  resolvedDeck={deck}
                />
              )}
              {deck.investigatorBack.card.code === attachment.code && (
                <AttachableCards
                  card={deck.investigatorBack.card}
                  definition={attachment}
                  resolvedDeck={deck}
                />
              )}
            </Fragment>
          ))}
        </Suspense>
      </article>
    </Scroller>
  );
}
