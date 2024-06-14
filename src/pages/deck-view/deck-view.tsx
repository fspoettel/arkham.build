import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Masthead } from "@/components/masthead";
import { Decklist } from "@/pages/deck-view/decklist";
import { useStore } from "@/store";
import { selectActiveDeck } from "@/store/selectors/decks";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./deck-view.module.css";

import { DeckSidebar } from "./deck-sidebar";

export function DeckView() {
  const deck = useStore(selectActiveDeck);

  useDocumentTitle(
    deck ? `${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  if (!deck) return null;

  return (
    <div className={css["container"]}>
      <Masthead />
      <main className={css["page"]}>
        <header className={css["page-header"]}>
          <h1 className={css["page-title"]}>{deck.name}</h1>
        </header>
        <DeckSidebar className={css["page-sidebar"]} deck={deck} />
        <div className={css["page-decklist"]}>
          <DecklistValidation defaultOpen />
          <Decklist deck={deck} />
        </div>
      </main>
    </div>
  );
}
