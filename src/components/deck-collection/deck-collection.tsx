import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "wouter";

import { useStore } from "@/store";
import { selectLocalDecks } from "@/store/selectors/decks";

import css from "./deck-collection.module.css";

import { Button } from "../ui/button";
import { Scroller } from "../ui/scroll-area";
import { DeckCard } from "./deck";
import { DeckCollectionImport } from "./deck-collection-import";

export function DeckCollection() {
  const decks = useStore(selectLocalDecks);

  return (
    <div className={css["deck-collection"]}>
      <header className={css["deck-collection-header"]}>
        <h2 className={css["deck-collection-title"]}>Decks</h2>
        <div className={css["deck-collection-actions"]}>
          <DeckCollectionImport />
          <Link href="/deck/new" asChild>
            <Button as="a" disabled>
              <PlusIcon />
            </Button>
          </Link>
        </div>
      </header>
      {decks.length ? (
        <Scroller>
          <ol className={css["deck-collection-decks"]}>
            {decks.map((deck) => (
              <li key={deck.id} className={css["deck-collection-deck"]}>
                <Link href={`/deck/${deck.id}/view`} asChild>
                  <a>
                    <DeckCard deck={deck} interactive />
                  </a>
                </Link>
              </li>
            ))}
          </ol>
        </Scroller>
      ) : (
        <div className={css["deck-collection-placeholder"]}>No decks.</div>
      )}
    </div>
  );
}
