import { Redirect, useParams } from "wouter";

import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { DeckTags } from "@/components/deck-tags";
import { Decklist } from "@/components/decklist/decklist";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Dialog } from "@/components/ui/dialog";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import {
  selectActiveDeckById,
  selectDeckValidById,
} from "@/store/selectors/deck-view";
import { DeckIdProvider } from "@/utils/use-deck-id";

import css from "./deck-view.module.css";

import { DeckNotes } from "./deck-notes";
import { Sidebar } from "./sidebar/sidebar";

function DeckView() {
  const { id } = useParams<{ id: string }>();
  const deck = useStore((state) => selectActiveDeckById(state, id));

  if (!deck) return <Redirect to="/404" />;

  return (
    <DeckIdProvider deckId={deck.id}>
      <CardModalProvider>
        <DeckViewInner deck={deck} />
      </CardModalProvider>
    </DeckIdProvider>
  );
}

function DeckViewInner({ deck }: { deck: DisplayDeck }) {
  const validation = useStore((state) => selectDeckValidById(state, deck.id));

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

export default DeckView;
