import { Redirect } from "wouter";

import { DeckTags } from "@/components/deck-tags";
import { Decklist } from "@/components/decklist/decklist";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Dialog } from "@/components/ui/dialog";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { selectActiveDeck } from "@/store/selectors/decks";

import css from "./deck-view.module.css";

import { DeckNotes } from "./deck-notes";
import { Sidebar } from "./sidebar/sidebar";

function DeckView() {
  const deckId = useStore((state) => state.deckView?.id);
  const deck = useStore(selectActiveDeck);

  if (deckId && !deck) {
    return <Redirect to="/404" />;
  }

  if (!deck) return null;

  return (
    <AppLayout
      title={
        deck ? `${deck.investigatorFront.card.real_name} - ${deck.name}` : ""
      }
    >
      <main className={css["main"]}>
        <header className={css["header"]}>
          <h1 className={css["title"]}>{deck.name}</h1>
          <DeckTags tags={deck.tags} />
        </header>
        <Sidebar className={css["sidebar"]} deck={deck} />
        <div className={css["content"]}>
          <DecklistValidation defaultOpen />
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

export default DeckView;
