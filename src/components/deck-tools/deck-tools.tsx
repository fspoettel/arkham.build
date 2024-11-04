import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Suspense, lazy } from "react";
import { Loader } from "../ui/loader";
import { Scroller } from "../ui/scroller";
import css from "./deck-tools.module.css";

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
      <div className={cx(css["deck-tools"])}>
        <div className={css["tools-header"]}>
          {slotLeft}
          {showTitle && <h3 className={css["tools-title"]}>Deck Tools</h3>}
          {slotRight}
        </div>
        <Suspense fallback={<Loader show message="Loading tools..." />}>
          <LazyChartContainer deck={deck} />
        </Suspense>
      </div>
    </Scroller>
  );
}
