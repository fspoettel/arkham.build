import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { useHotKey } from "@/utils/use-hotkey";
import css from "./sidebar.module.css";

type Props = {
  deck: DisplayDeck;
};

export function SidebarActions(props: Props) {
  const showToast = useToast();
  const [, setLocation] = useLocation();

  const deleteDeck = useStore((state) => state.deleteDeck);
  const duplicateDeck = useStore((state) => state.duplicateDeck);

  const [actionsOpen, setActionsOpen] = useState(false);

  const onDelete = useCallback(() => {
    const confirmed = confirm("Are you sure you want to delete this deck?");
    if (confirmed) {
      deleteDeck(props.deck.id);
      setLocation("~/");
      showToast({
        duration: 2000,
        children: "Successfully deleted deck.",
        variant: "success",
      });
    }
  }, [props.deck.id, deleteDeck, setLocation, showToast]);

  const onDuplicate = useCallback(() => {
    try {
      const id = duplicateDeck(props.deck.id);
      setLocation(`/deck/view/${id}`);
      showToast({
        duration: 2000,
        children: "Successfully duplicated deck.",
        variant: "success",
      });
    } catch (err) {
      showToast({
        duration: 2000,
        children: `Failed to duplicate deck: ${(err as Error)?.message}`,
        variant: "error",
      });
    }

    setActionsOpen(false);
  }, [props.deck.id, duplicateDeck, setLocation, showToast]);

  const onEdit = useCallback(() => {
    setLocation(`/deck/edit/${props.deck.id}`);
  }, [props.deck.id, setLocation]);

  useHotKey("e", onEdit, [onEdit]);
  useHotKey("cmd+d", onDuplicate, [onDuplicate]);
  useHotKey("cmd+backspace", onDelete, [onDelete]);

  const isReadOnly = !!props.deck.next_deck;

  return (
    <>
      {isReadOnly && (
        <Notice variant="info">
          There is a{" "}
          <Link href={`/deck/view/${props.deck.next_deck}`}>newer version</Link>{" "}
          of this deck. This deck is read-only.
        </Notice>
      )}
      <div className={css["actions"]}>
        <Button
          data-testid="view-edit"
          disabled={isReadOnly}
          onClick={onEdit}
          size="full"
        >
          <Pencil /> Edit
        </Button>
        <Button data-testid="view-upgrade" disabled size="full">
          <i className="icon-xp-bold" /> Upgrade
        </Button>
        <Popover
          placement="bottom-start"
          open={actionsOpen}
          onOpenChange={setActionsOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="bare"
              data-testid="view-more-actions"
              tooltip="More actions"
            >
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <DropdownMenu>
              <Button
                data-testid="view-duplicate"
                onClick={onDuplicate}
                size="full"
                variant="bare"
              >
                <Copy />
                Duplicate
              </Button>
              <hr />
              <Button
                data-testid="view-delete"
                disabled={isReadOnly}
                onClick={onDelete}
                size="full"
                variant="bare"
              >
                <Trash2 /> Delete
              </Button>
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
