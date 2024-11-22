import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import { extendedDeckTags } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectDeckHistory } from "@/store/selectors/decks";
import { useAccentColor } from "@/utils/use-accent-color";
import { ChartAreaIcon, FileClockIcon } from "lucide-react";
import { DeckTags } from "../deck-tags";
import { DeckTools } from "../deck-tools/deck-tools";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import { LimitedCardPoolTag, SealedDeckTag } from "../limited-card-pool";
import { Dialog } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import css from "./deck-display.module.css";
import { DeckHistory } from "./deck-history/deck-history";
import { DeckNotes } from "./deck-notes";
import { Sidebar } from "./sidebar";

type Props = {
  deck: ResolvedDeck;
  owned: boolean;
  validation: DeckValidationResult;
};

export function DeckDisplay(props: Props) {
  const { deck, owned, validation } = props;

  const cssVariables = useAccentColor(deck.investigatorBack.card.faction_code);
  const history = useStore((state) => selectDeckHistory(state, deck.id));
  const hasHistory = !!history.length;

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
          <Tabs length={hasHistory ? 3 : 2} defaultValue="deck">
            <TabsList>
              <TabsTrigger value="deck" data-testid="tab-deck">
                <i className="icon-deck" /> Deck list
              </TabsTrigger>
              <TabsTrigger value="tools">
                <ChartAreaIcon /> Tools
              </TabsTrigger>
              {hasHistory && (
                <TabsTrigger value="history" data-testid="tab-history">
                  <FileClockIcon /> Upgrade history ({history.length})
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
            {hasHistory && (
              <TabsContent className={css["tab"]} value="history">
                <DeckHistory history={history} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      {deck.description_md && (
        <Dialog>
          <DeckNotes deck={deck} />
        </Dialog>
      )}
    </AppLayout>
  );
}
