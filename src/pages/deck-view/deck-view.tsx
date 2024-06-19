import { useCallback } from "react";
import { Redirect, useParams } from "wouter";

import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { DeckTags } from "@/components/deck-tags";
import { Decklist } from "@/components/decklist/decklist";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Dialog } from "@/components/ui/dialog";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import {
  selectActiveDeckById,
  selectDeckValidById,
} from "@/store/selectors/deck-view";

import css from "./deck-view.module.css";

import { DeckNotes } from "./deck-notes";
import { Sidebar } from "./sidebar/sidebar";

function DeckView() {
  const cardModalContext = useCardModalContext();
  const { id } = useParams<{ id: string }>();

  const deck = useStore((state) => selectActiveDeckById(state, id));
  const validation = useStore((state) => selectDeckValidById(state, id));

  const onOpenModal = useCallback(
    (code: string) => {
      cardModalContext.setOpen({ code, deckId: id });
    },
    [cardModalContext, id],
  );

  if (!deck) return <Redirect to="/404" />;

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
          <Decklist deck={deck} onOpenModal={onOpenModal} />
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
