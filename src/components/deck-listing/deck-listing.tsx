import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "wouter";

import css from "./deck-listing.module.css";

import { Button } from "../ui/button";
import { Scroller } from "../ui/scroll-area";

export function Decklisting() {
  const decks = [];

  return (
    <div className={css["decklisting"]}>
      <header className={css["decklisting-header"]}>
        <h2 className={css["decklisting-title"]}>Decks</h2>
        <Link href="/deck/new">
          <Button as="a" disabled>
            <PlusIcon />
          </Button>
        </Link>
      </header>
      {decks.length ? (
        <Scroller>
          <ol className={css["decklisting-decks"]}>
            <li className={css["decklisting-deck"]}>Foo</li>
          </ol>
        </Scroller>
      ) : (
        <div className={css["decklisting-placeholder"]}>No decks.</div>
      )}
    </div>
  );
}
