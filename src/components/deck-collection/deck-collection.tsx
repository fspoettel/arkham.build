import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "wouter";

import { useStore } from "@/store";
import { selectLocalDecks } from "@/store/selectors/decks";
import { capitalize } from "@/utils/formatting";

import css from "./deck-collection.module.css";

import { Button } from "../ui/button";
import { Scroller } from "../ui/scroller";
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
          <Link asChild href="/deck/new">
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
              <li className={css["deck-collection-deck"]} key={deck.id}>
                <Link asChild href={`/deck/${deck.id}/view`}>
                  <a>
                    <DeckCard deck={deck} interactive>
                      {deck.tags
                        ? deck.tags.split(" ").map((s) => capitalize(s))
                        : undefined}
                    </DeckCard>
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
