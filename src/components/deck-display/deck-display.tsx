import { AppLayout } from "@/layouts/app-layout";

import { DeckNotes } from "@/pages/deck-view/deck-notes";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { ResolvedDeck } from "@/store/lib/types";
import { DeckTags } from "../deck-tags";
import { Decklist } from "../decklist/decklist";
import { DecklistValidation } from "../decklist/decklist-validation";
import { Dialog } from "../ui/dialog";
import css from "./deck-display.module.css";
import { Sidebar } from "./sidebar/sidebar";

type Props = {
  deck: ResolvedDeck;
  owned: boolean;
  validation: DeckValidationResult;
};

export function DeckDisplay(props: Props) {
  const { deck, owned, validation } = props;

  return (
    <AppLayout
      title={
        deck ? `${deck.investigatorFront.card.real_name} - ${deck.name}` : ""
      }
    >
      <main className={css["main"]}>
        <header className={css["header"]}>
          <h1 className={css["title"]} data-testid="view-title">
            {deck.name}
          </h1>
          <DeckTags tags={deck.tags} />
        </header>
        <Sidebar className={css["sidebar"]} deck={deck} owned={owned} />
        <div className={css["content"]}>
          <DecklistValidation defaultOpen validation={validation} />
          <Decklist deck={deck} />
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
