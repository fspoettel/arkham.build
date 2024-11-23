import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import { extendedDeckTags } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectDeckHistory } from "@/store/selectors/decks";
import { useAccentColor } from "@/utils/use-accent-color";
import { BookOpenTextIcon, ChartAreaIcon, FileClockIcon } from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useRef } from "react";
import { DeckTags } from "../deck-tags";
import { DeckTools } from "../deck-tools/deck-tools";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import { LimitedCardPoolTag, SealedDeckTag } from "../limited-card-pool";
import { Loader } from "../ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import css from "./deck-display.module.css";
import { DeckHistory } from "./deck-history/deck-history";
import { Sidebar } from "./sidebar";

type Props = {
  deck: ResolvedDeck;
  owned: boolean;
  validation: DeckValidationResult;
};

const LazyDeckDescription = lazy(() => import("@/components/deck-description"));

export function DeckDisplay(props: Props) {
  const { deck, owned, validation } = props;

  const cssVariables = useAccentColor(deck.investigatorBack.card.faction_code);
  const history = useStore((state) => selectDeckHistory(state, deck.id));
  const hasHistory = !!history.length;

  const tabRef = useRef("deck");
  const scrollPosition = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (tabRef.current === "notes") {
        scrollPosition.current = window.scrollY;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onTabChange = useCallback((val: string) => {
    setTimeout(() => {
      window.scrollTo({
        top: val === "notes" ? scrollPosition.current : 0,
      });
    });

    tabRef.current = val;
  }, []);

  return (
    <AppLayout title={deck ? deck.name : ""}>
      <main className={css["main"]} style={cssVariables}>
        <header className={css["header"]}>
          <h1 className={css["title"]} data-testid="view-title">
            {deck.name}
          </h1>
          <div className={css["tags"]}>
            <DeckTags tags={extendedDeckTags(deck, false)} />
            <LimitedCardPoolTag />
            <SealedDeckTag />
          </div>
        </header>

        <Sidebar className={css["sidebar"]} deck={deck} owned={owned} />

        <div className={css["content"]}>
          <Tabs
            className={css["tabs"]}
            length={hasHistory ? 3 : 2}
            defaultValue="deck"
            onValueChange={onTabChange}
          >
            <TabsList className={css["list"]}>
              <TabsTrigger value="deck" data-testid="tab-deck" tooltip="Deck">
                <i className="icon-deck" />
                <span>Deck</span>
              </TabsTrigger>
              {deck.description_md && (
                <TabsTrigger
                  value="notes"
                  data-testid="tab-notes"
                  tooltip="Notes"
                >
                  <BookOpenTextIcon />
                  <span>Notes</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="tools" tooltip="Tools">
                <ChartAreaIcon />
                <span>Tools</span>
              </TabsTrigger>
              {hasHistory && (
                <TabsTrigger
                  value="history"
                  data-testid="tab-history"
                  tooltip={`Upgrades (${history.length})`}
                >
                  <FileClockIcon />
                  <span>Upgrades ({history.length})</span>
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent className={css["tab"]} value="deck">
              <DecklistValidation
                defaultOpen={validation.errors.length < 3}
                validation={validation}
              />
              <Decklist deck={deck} />
            </TabsContent>
            <TabsContent className={css["tab"]} value="tools">
              <DeckTools deck={deck} />
            </TabsContent>
            {deck.description_md && (
              <TabsContent className={css["tab"]} value="notes">
                <Suspense fallback={<Loader show message="Loading notes..." />}>
                  <LazyDeckDescription
                    content={deck.description_md}
                    title={deck.name}
                  />
                </Suspense>
              </TabsContent>
            )}
            {hasHistory && (
              <TabsContent className={css["tab"]} value="history">
                <DeckHistory history={history} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </AppLayout>
  );
}
