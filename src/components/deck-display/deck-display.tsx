import { AppLayout } from "@/layouts/app-layout";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import { deckTags, extendedDeckTags } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import type { History } from "@/store/selectors/decks";
import { isEmpty } from "@/utils/is-empty";
import { useAccentColor } from "@/utils/use-accent-color";
import { BookOpenTextIcon, ChartAreaIcon, FileClockIcon } from "lucide-react";
import { Suspense, useCallback, useRef, useState } from "react";
import DeckDescription from "../deck-description";
import { DeckTags } from "../deck-tags";
import { DeckTools } from "../deck-tools/deck-tools";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import type { ViewMode } from "../decklist/decklist.types";
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

export function DeckDisplay(props: DeckDisplayProps) {
  const { origin, deck, history, validation } = props;

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentTab, setCurrentTab] = useState("deck");
  const contentRef = useRef<HTMLDivElement>(null);

  const cssVariables = useAccentColor(deck.investigatorBack.card.faction_code);
  const hasHistory = !isEmpty(history);

  const onTabChange = useCallback((val: string) => {
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
          {deck.metaParsed?.banner_url && (
            <div className={css["banner"]}>
              <img alt="Deck banner" src={deck.metaParsed.banner_url} />
            </div>
          )}
          {deck.metaParsed.intro_md && (
            <div className={css["description"]}>
              <DeckDescription content={deck.metaParsed.intro_md} centered />
            </div>
          )}
        </header>

        <Dialog>
          <Sidebar className={css["sidebar"]} deck={deck} origin={origin} />
        </Dialog>

        <div className={css["content"]}>
          <Tabs
            className={css["tabs"]}
            value={currentTab}
            onValueChange={onTabChange}
            ref={contentRef}
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
              <div className={css["tab-content"]}>
                <DecklistValidation
                  defaultOpen={validation.errors.length < 3}
                  validation={validation}
                />
                <Decklist
                  deck={deck}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>
            </TabsContent>
            <TabsContent className={css["tab"]} value="tools">
              <DeckTools deck={deck} readonly />
            </TabsContent>
            {deck.description_md && (
              <TabsContent className={css["tab"]} value="notes">
                <Suspense fallback={<Loader show message="Loading notes..." />}>
                  <div className={css["description"]}>
                    <DeckDescription content={deck.description_md} centered />
                  </div>
                </Suspense>
              </TabsContent>
            )}
            {hasHistory && (
              <TabsContent className={css["tab"]} value="history">
                <DeckHistory deck={deck} history={history} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </AppLayout>
  );
}
