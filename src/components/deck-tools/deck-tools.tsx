import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Suspense, forwardRef, lazy } from "react";
import { Loader } from "../ui/loader";
import { Scroller } from "../ui/scroller";
import { AllAttachables } from "./all-attachables";
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
  const { deck, readonly, scrollable, showTitle } = props;

  const node = (
    <article className={cx(css["deck-tools"])} ref={ref}>
      {showTitle && (
        <header className={css["tools-header"]}>
          {showTitle && <h3 className={css["tools-title"]}>Deck Tools</h3>}
        </header>
      )}
      <Suspense fallback={<Loader show message="Loading tools..." />}>
        <LazyChartContainer deck={deck} />
        <LimitedSlots deck={deck} />
        <AllAttachables deck={deck} readonly={readonly} />
      </Suspense>
    </article>
  );

  return scrollable ? (
    <Scroller className={css["scroller"]}>{node}</Scroller>
  ) : (
    node
  );
});
