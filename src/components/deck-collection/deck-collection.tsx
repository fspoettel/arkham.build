import { Plus } from "lucide-react";
import { Link } from "wouter";

import { useStore } from "@/store";
import { selectLocalDecks } from "@/store/selectors/decks";
import { capitalize } from "@/utils/formatting";

import css from "./deck-collection.module.css";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Scroller } from "../ui/scroller";
import { Tag } from "../ui/tag";
import { DeckCard } from "./deck-card";
import { DeckCollectionImport } from "./deck-collection-import";

export function DeckCollection() {
  const decks = useStore(selectLocalDecks);

  return (
    <div className={css["deck-collection"]}>
      <header className={css["deck-collection-header"]}>
        <h2 className={css["deck-collection-title"]}>Decks</h2>
        <div className={css["deck-collection-actions"]}>
          <Dialog>
            <DeckCollectionImport />
          </Dialog>
          <Link asChild href="/deck/new">
            <Button as="a" disabled>
              <Plus />
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
                    <DeckCard
                      deck={deck}
                      interactive
                      showThumbnail
                      showValidation
                    >
                      {!!deck.tags.length && (
                        <ul className={css["deck-collection-tags"]}>
                          {deck.tags
                            ? deck.tags.split(" ").map((s, i) => (
                                <Tag as="li" key={i} size="xs">
                                  {capitalize(s).trim()}
                                </Tag>
                              ))
                            : undefined}
                        </ul>
                      )}
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
