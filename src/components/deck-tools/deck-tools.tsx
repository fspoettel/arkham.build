import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Rows3Icon } from "lucide-react";
import { Suspense, lazy } from "react";
import { Link } from "wouter";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { Scroller } from "../ui/scroller";
import css from "./deck-tools.module.css";

type Props = {
  deck: ResolvedDeck;
  slotLeft?: React.ReactNode;
};

const LazyChartContainer = lazy(() => import("./chart-container"));

export function DeckTools(props: Props) {
  const { deck, slotLeft } = props;

  return (
    <Scroller>
      <div className={cx(css["deck-tools"])}>
        <div className={css["tools-header"]}>
          {slotLeft}
          <h3 className={css["tools-title"]}>Deck Tools</h3>
          <Link to="/" asChild>
            <Button as="a">
              <Rows3Icon />
              Back to card list
            </Button>
          </Link>
        </div>
        <Suspense fallback={<Loader show message="Loading tools..." />}>
          <LazyChartContainer deck={deck} />
        </Suspense>
      </div>
    </Scroller>
  );
}
