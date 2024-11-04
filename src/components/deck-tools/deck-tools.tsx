import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { X } from "lucide-react";
import { Suspense, lazy } from "react";
import layoutCss from "../../layouts/list-layout.module.css";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import css from "./deck-tools.module.css";

type Props = {
  deck: ResolvedDeck;
};

const LazyChartContainer = lazy(() => import("./chart-container"));

export const DeckTools = (props: Props) => {
  const active = useStore((state) => state.ui.deckToolsOpen);
  const setDeckToolsOpen = useStore((state) => state.setDeckToolsOpen);

  return (
    <div
      className={cx(
        layoutCss["layout-area"],
        css["deck-tools"],
        active && css["transition"],
      )}
    >
      <div className={css["tools-header"]}>
        <h3 className={css["tools-title"]}>Deck Tools</h3>
        <Button iconOnly size="lg" onClick={() => setDeckToolsOpen(false)}>
          <X />
        </Button>
      </div>
      {active && (
        <Suspense fallback={<Loader show message="Loading tools..." />}>
          <LazyChartContainer deck={props.deck} />
        </Suspense>
      )}
    </div>
  );
};
