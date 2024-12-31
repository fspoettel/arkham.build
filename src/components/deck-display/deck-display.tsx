import { AppLayout } from "@/layouts/app-layout";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import { deckTags, extendedDeckTags } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import type { History } from "@/store/selectors/decks";
import { useAccentColor } from "@/utils/use-accent-color";
import { BookOpenTextIcon, ChartAreaIcon, FileClockIcon } from "lucide-react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DeckTags } from "../deck-tags";
import { DeckTools } from "../deck-tools/deck-tools";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import { LimitedCardPoolTag, SealedDeckTag } from "../limited-card-pool";
import { Dialog } from "../ui/dialog";
import { Loader } from "../ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import css from "./deck-display.module.css";
import { DeckHistory } from "./deck-history/deck-history";
import { Sidebar } from "./sidebar";
import type { DeckOrigin } from "./types";

export type DeckDisplayProps = {
  deck: ResolvedDeck;
  origin: DeckOrigin;
  history?: History;
  validation: DeckValidationResult;
};

const LazyDeckDescription = lazy(() => import("@/components/deck-description"));

export function DeckDisplay(props: DeckDisplayProps) {
  const { origin, deck, history, validation } = props;

  const [currentTab, setCurrentTab] = useState("deck");

  const cssVariables = useAccentColor(deck.investigatorBack.card.faction_code);
  const hasHistory = !!history?.length;

  const contentRef = useRef<HTMLDivElement>(null);
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
        top:
          val === "notes"
            ? scrollPosition.current
            : (contentRef.current?.offsetTop ?? 0),
      });
    });

    tabRef.current = val;
    setCurrentTab(val);
  }, []);

  return (
    <AppLayout title={deck ? deck.name : ""}>
      <main className={css["main"]} style={cssVariables}>
        <header className={css["header"]}>
          <h1 className={css["title"]} data-testid="view-title">
            {deck.name}
          </h1>
          <div className={css["tags"]}>
            <DeckTags
              tags={
                origin === "local"
                  ? extendedDeckTags(deck, false)
                  : deckTags(deck)
              }
            />
            <LimitedCardPoolTag />
            <SealedDeckTag />
          </div>
        </header>

        <Dialog>
          <Sidebar className={css["sidebar"]} deck={deck} origin={origin} />
        </Dialog>

        <div className={css["content"]} ref={contentRef}>
          <Tabs
            className={css["tabs"]}
            value={currentTab}
            onValueChange={onTabChange}
          >
            <TabsList className={css["list"]}>
              <TabsTrigger
                data-testid="tab-deck"
                hotkey="d"
                onTabChange={onTabChange}
                tooltip="Deck list"
                value="deck"
              >
                <i className="icon-deck" />
                <span>Deck</span>
              </TabsTrigger>
              {deck.description_md && (
                <TabsTrigger
                  data-testid="tab-notes"
                  hotkey="n"
                  onTabChange={onTabChange}
                  tooltip="Deck notes"
                  value="notes"
                >
                  <BookOpenTextIcon />
                  <span>Notes</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                hotkey="t"
                onTabChange={onTabChange}
                tooltip="Deck tools"
                value="tools"
              >
                <ChartAreaIcon />
                <span>Tools</span>
              </TabsTrigger>
              {hasHistory && (
                <TabsTrigger
                  data-testid="tab-history"
                  hotkey="h"
                  onTabChange={onTabChange}
                  tooltip="Upgrade history"
                  value="history"
                >
                  <FileClockIcon />
                  <span>History ({history.length})</span>
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
              <DeckTools deck={deck} readonly />
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
