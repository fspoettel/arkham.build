import { Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { useConfirmation } from "@/components/ui/confirmation-dialog.hook";
import { Notice } from "@/components/ui/notice";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";

import css from "./sidebar.module.css";

type Props = {
  deck: DisplayDeck;
};

export function SidebarActions({ deck }: Props) {
  const [, setLocation] = useLocation();
  const [dialog, showConfirmation] = useConfirmation();
  const deleteDeck = useStore((state) => state.deleteDeck);

  const onDelete = useCallback(async () => {
    const confirmed = await showConfirmation({
      message: "Are you sure you want to delete this deck?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (confirmed) {
      deleteDeck(deck.id);
      setLocation("~/");
    }
  }, [deck.id, deleteDeck, showConfirmation, setLocation]);

  const isReadOnly = !!deck.next_deck;

  return (
    <>
      {isReadOnly && (
        <Notice variant="info">
          There is a{" "}
          <Link href={`/deck/view/${deck.next_deck}`}>newer version</Link> of
          this deck. This deck is read-only.
        </Notice>
      )}
      <div className={css["actions"]}>
        <Link asChild href={`/deck/edit/${deck.id}`}>
          <Button as="a" disabled={isReadOnly} size="full">
            <Pencil /> Edit
          </Button>
        </Link>

        <Button disabled={isReadOnly} onClick={onDelete} size="full">
          <Trash2 /> Delete
        </Button>
      </div>
      {dialog}
    </>
  );
}
