import { AppLayout } from "@/layouts/app-layout";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import { deckTags, extendedDeckTags } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import type { History } from "@/store/selectors/decks";
import { isEmpty } from "@/utils/is-empty";
import { useAccentColor } from "@/utils/use-accent-color";
import { BookOpenTextIcon, ChartAreaIcon, FileClockIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DeckDescription from "../deck-description";
import { DeckTags } from "../deck-tags";
import { DeckTools } from "../deck-tools/deck-tools";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import type { ViewMode } from "../decklist/decklist.types";
import { LimitedCardPoolTag, SealedDeckTag } from "../limited-card-pool";
import { Dialog } from "../ui/dialog";
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

  const { t } = useTranslation();
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
                tooltip={t("deck_view.tab_deck_list")}
                value="deck"
              >
                <i className="icon-deck" />
                <span>{t("deck_view.tab_deck_list")}</span>
              </TabsTrigger>
              {deck.description_md && (
                <TabsTrigger
                  data-testid="tab-notes"
                  hotkey="n"
                  onTabChange={onTabChange}
                  tooltip={t("deck_view.tab_notes")}
                  value="notes"
                >
                  <BookOpenTextIcon />
                  <span>{t("deck_view.tab_notes")}</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                hotkey="t"
                onTabChange={onTabChange}
                tooltip={t("deck_view.tab_tools")}
                value="tools"
              >
                <ChartAreaIcon />
                <span>{t("deck_view.tab_tools")}</span>
              </TabsTrigger>
              {hasHistory && (
                <TabsTrigger
                  data-testid="tab-history"
                  hotkey="h"
                  onTabChange={onTabChange}
                  tooltip={t("deck_view.tab_history")}
                  value="history"
                >
                  <FileClockIcon />
                  <span>
                    {t("deck_view.tab_history")} ({history.length - 1})
                  </span>
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
                <div className={css["description"]}>
                  <DeckDescription content={deck.description_md} centered />
                </div>
              </TabsContent>
            )}
            {hasHistory && (
              <TabsContent className={css["tab"]} value="history">
                <DeckHistory deck={deck} history={history} origin={origin} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </AppLayout>
  );
}
