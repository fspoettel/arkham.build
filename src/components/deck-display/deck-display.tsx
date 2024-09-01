import { AppLayout } from "@/layouts/app-layout";

import { useStore } from "@/store";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectDeckHistory } from "@/store/selectors/decks";
import { useAccentColor } from "@/utils/use-accent-color";
import { FileClock } from "lucide-react";
import { DeckTags } from "../deck-tags";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import { Dialog } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import css from "./deck-display.module.css";
import { DeckHistory } from "./deck-history/deck-history";
import { DeckNotes } from "./deck-notes";
import { Sidebar } from "./sidebar/sidebar";

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

  const decklist = (
    <>
      <DecklistValidation
        defaultOpen={validation.errors.length < 3}
        validation={validation}
      />
      <Decklist deck={deck} />
    </>
  );

  return (
    <AppLayout
      title={
        deck ? `${deck.investigatorFront.card.real_name} - ${deck.name}` : ""
      }
    >
      <main className={css["main"]} style={cssVariables}>
        <header className={css["header"]}>
          <h1 className={css["title"]} data-testid="view-title">
            {deck.name}
          </h1>
          <DeckTags tags={deck.tags} />
        </header>
        <Sidebar className={css["sidebar"]} deck={deck} owned={owned} />

        <div className={css["content"]}>
          {hasHistory ? (
            <Tabs length={2} defaultValue="deck">
              <TabsList>
                <TabsTrigger value="deck" data-testid="tab-deck">
                  <i className="icon-deck" /> Deck
                </TabsTrigger>
                <TabsTrigger value="history" data-testid="tab-history">
                  <FileClock /> Upgrade history ({history.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent className={css["tab"]} value="deck">
                {decklist}
              </TabsContent>
              <TabsContent className={css["tab"]} value="history">
                <DeckHistory history={history} />
              </TabsContent>
            </Tabs>
          ) : (
            decklist
          )}
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
