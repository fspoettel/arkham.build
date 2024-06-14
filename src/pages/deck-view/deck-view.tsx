import { DeckTags } from "@/components/deck-tags";
import { Decklist } from "@/components/decklist/decklist";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Masthead } from "@/components/masthead";
import { Dialog } from "@/components/ui/dialog";
import { useStore } from "@/store";
import { selectActiveDeck } from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./deck-view.module.css";

import { DeckNotes } from "./deck-notes";
import { Sidebar } from "./sidebar/sidebar";

function DeckView() {
  const deck = useStore(selectActiveDeck);

  useDocumentTitle(
    deck ? `${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  if (!deck) return null;

  return (
    <div className={css["container"]}>
      <Masthead />
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
    </div>
  );
}

export default DeckView;
