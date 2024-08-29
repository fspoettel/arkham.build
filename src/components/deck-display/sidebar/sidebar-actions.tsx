import { Copy, Download, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UpgradeModal } from "@/pages/deck-view/upgrade-modal";
import type { ResolvedDeck } from "@/store/lib/types";
import { useHotKey } from "@/utils/use-hotkey";
import {
  useDeleteDeck,
  useDeleteUpgrade,
  useDuplicateDeck,
  useExportJson,
  useExportText,
} from "../hooks";
import css from "./sidebar.module.css";

type Props = {
  deck: ResolvedDeck;
};

export function SidebarActions(props: Props) {
  const { deck } = props;

  const [, setLocation] = useLocation();

  const [actionsOpen, setActionsOpen] = useState(false);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(
    window.location.hash.includes("upgrade"),
  );

  const deleteDeck = useDeleteDeck();
  const onDelete = useCallback(() => {
    deleteDeck(deck.id);
  }, [deck.id, deleteDeck]);

  const deleteUpgrade = useDeleteUpgrade();
  const onDeleteUpgrade = useCallback(() => {
    deleteUpgrade(deck.id);
  }, [deleteUpgrade, deck.id]);

  const duplicateDeck = useDuplicateDeck();
  const onDuplicate = useCallback(() => {
    setActionsOpen(false);
    duplicateDeck(deck.id);
  }, [deck.id, duplicateDeck]);

  const exportJson = useExportJson();
  const onExportJson = useCallback(() => {
    exportJson(deck.id);
  }, [deck.id, exportJson]);

  const exportText = useExportText();
  const onExportText = useCallback(() => {
    exportText(deck.id);
  }, [deck.id, exportText]);

  const onUpgradeModalOpenChange = (val: boolean) => {
    setUpgradeModalOpen(val);
    if (!val && window.location.hash.includes("upgrade")) {
      history.replaceState(null, "", " ");
    }
  };

  const onEdit = () => {
    setLocation(`/deck/edit/${deck.id}`);
  };

  useHotKey("e", onEdit, [onEdit]);
  useHotKey("cmd+d", onDuplicate, [onDuplicate]);
  useHotKey("cmd+backspace", onDelete, [onDelete]);

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
        <Button
          data-testid="view-edit"
          disabled={isReadOnly}
          onClick={onEdit}
          size="full"
        >
          <Pencil /> Edit
        </Button>
        <Dialog onOpenChange={onUpgradeModalOpenChange} open={upgradeModalOpen}>
          <DialogTrigger asChild>
            <Button
              data-testid="view-upgrade"
              disabled={isReadOnly}
              size="full"
            >
              <i className="icon-xp-bold" /> Upgrade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <UpgradeModal deck={deck} />
          </DialogContent>
        </Dialog>
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
                data-testid="view-export-json"
                size="full"
                variant="bare"
                onClick={onExportJson}
              >
                <Download /> Export JSON
              </Button>
              <Button
                data-testid="view-export-text"
                size="full"
                variant="bare"
                onClick={onExportText}
              >
                <Download /> Export Markdown
              </Button>
              <hr />
              {!!deck.previous_deck && (
                <Button
                  data-testid="view-delete-upgrade"
                  disabled={isReadOnly}
                  onClick={onDeleteUpgrade}
                  size="full"
                  variant="bare"
                >
                  <i className="icon-xp-bold" /> Delete upgrade
                </Button>
              )}
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
