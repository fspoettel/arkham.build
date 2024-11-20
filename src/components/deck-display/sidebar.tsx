import { DeckInvestigator } from "@/components/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Notice } from "@/components/ui/notice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast.hooks";
import { UpgradeModal } from "@/pages/deck-view/upgrade-modal";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import {
  capitalize,
  capitalizeSnakeCase,
  formatTabooSet,
} from "@/utils/formatting";
import { useHotKey } from "@/utils/use-hotkey";
import {
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  ImportIcon,
  PencilIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { LatestUpgrade } from "./deck-history/latest-upgrade";
import {
  useDeleteDeck,
  useDeleteUpgrade,
  useDuplicateDeck,
  useExportJson,
  useExportText,
} from "./hooks";
import css from "./sidebar.module.css";

type Props = {
  className?: string;
  deck: ResolvedDeck;
  owned?: boolean;
};

export function Sidebar(props: Props) {
  const { className, deck, owned } = props;

  return (
    <div className={cx(css["container"], className)}>
      <DeckInvestigator deck={deck} size="tooltip" />
      <SidebarActions deck={deck} owned={owned} />
      <SidebarDetails deck={deck} />
      <SidebarUpgrade deck={deck} />
      {owned && <Sharing deck={deck} />}
    </div>
  );
}

function SidebarDetails(props: { deck: ResolvedDeck }) {
  const { deck } = props;

  return (
    <ul className={css["details"]}>
      <li className={css["detail"]} data-testid="view-deck-size">
        <div className={css["detail-label"]}>
          <i className="icon-card-outline-bold" /> Deck size
        </div>
        <p className={css["detail-value"]}>
          {deck.stats.deckSize} ({deck.stats.deckSizeTotal} total)
        </p>
      </li>

      <li className={css["detail"]} data-testid="view-deck-xp">
        <div className={css["detail-label"]}>
          <i className="icon-xp-bold" /> XP required
        </div>
        <p className={css["detail-value"]}>{deck.stats.xpRequired}</p>
      </li>

      <li className={css["detail"]} data-testid="view-deck-taboo">
        <div className={css["detail-label"]}>
          <i className="icon-taboo" /> Taboo
        </div>
        <p className={css["detail-value"]}>
          {deck.tabooSet ? (
            <span>{formatTabooSet(deck.tabooSet)}</span>
          ) : (
            "None"
          )}
        </p>
      </li>

      {!!deck.selections &&
        Object.entries(deck.selections).map(([key, selection]) => (
          <li
            className={css["detail"]}
            key={key}
            data-testid={`selection-${key}`}
          >
            <div
              className={css["detail-label"]}
              data-testid={`selection-${key}-label`}
            >
              {capitalizeSnakeCase(key)}
            </div>
            {selection.type === "deckSize" && (
              <p
                className={css["detail-value"]}
                data-testid={`selection-${key}-value`}
              >
                {selection.value}
              </p>
            )}
            {selection.type === "faction" && (
              <p
                className={css["detail-value"]}
                data-testid={`selection-${key}-value`}
              >
                {selection.value ? (
                  <>
                    <FactionIcon code={selection.value} />
                    {capitalize(selection.value)}
                  </>
                ) : (
                  "None"
                )}
              </p>
            )}
            {selection.type === "option" && (
              <p
                className={css["detail-value"]}
                data-testid={`selection-${key}-value`}
              >
                {selection.value?.name ?? "None"}
              </p>
            )}
          </li>
        ))}
    </ul>
  );
}

function SidebarUpgrade(props: { deck: ResolvedDeck }) {
  const { deck } = props;

  if (!deck.previous_deck) return null;

  return (
    <section className={css["details"]} data-testid="share">
      <div
        className={cx(css["detail"], css["full"])}
        data-testid="view-latest-upgrade"
      >
        <header>
          <h3 className={css["detail-label"]}>
            <i className="icon-upgrade" />
            Latest upgrade
          </h3>
        </header>
        <div className={css["detail-value"]}>
          <LatestUpgrade deck={deck} readonly />
        </div>
      </div>
    </section>
  );
}

function SidebarActions(props: { deck: ResolvedDeck; owned?: boolean }) {
  const { deck, owned } = props;

  const [actionsOpen, setActionsOpen] = useState(false);

  const toast = useToast();
  const [, navigate] = useLocation();

  const search = useSearch();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(
    owned && search.includes("upgrade") && !deck.next_deck,
  );

  const deleteDeck = useDeleteDeck();
  const onDelete = useCallback(
    () => deleteDeck(deck.id),
    [deck.id, deleteDeck],
  );

  const deleteUpgrade = useDeleteUpgrade();
  const onDeleteUpgrade = useCallback(
    () => deleteUpgrade(deck.id),
    [deleteUpgrade, deck.id],
  );

  const exportJson = useExportJson();
  const onExportJson = useCallback(
    () => exportJson(deck.id),
    [deck.id, exportJson],
  );

  const exportText = useExportText();
  const onExportText = useCallback(
    () => exportText(deck.id),
    [deck.id, exportText],
  );

  const duplicateDeck = useDuplicateDeck();
  const onDuplicate = useCallback(() => {
    setActionsOpen(false);
    duplicateDeck(deck.id);
  }, [deck.id, duplicateDeck]);

  const onUpgradeModalOpenChange = (val: boolean) => {
    setUpgradeModalOpen(val);
    if (!val && window.location.hash.includes("upgrade")) {
      history.replaceState(null, "", " ");
    }
  };

  const onEdit = useCallback(() => {
    navigate(`/deck/edit/${deck.id}`);
  }, [deck.id, navigate]);

  const importSharedDeck = useStore((state) => state.importSharedDeck);
  const onImport = useCallback(() => {
    try {
      const id = importSharedDeck(deck);

      toast.show({
        children: "Deck import successful.",
        variant: "success",
        duration: 3000,
      });

      navigate(`/deck/view/${id}`);
    } catch (err) {
      toast.show({
        children: `Failed to import deck: ${(err as Error).message}`,
        variant: "error",
      });
    }
  }, [deck, importSharedDeck, toast.show, navigate]);

  useHotKey("e", onEdit, [onEdit]);
  useHotKey("cmd+d", onDuplicate, [onDuplicate]);
  useHotKey("cmd+backspace", onDelete, [onDelete]);

  const isReadOnly = !!deck.next_deck;

  return (
    <>
      {isReadOnly && (
        <Notice variant="info">
          There is a{" "}
          <Link href={`${owned ? "/deck/view/" : "/share/"}${deck.next_deck}`}>
            newer version
          </Link>{" "}
          of this deck. This deck is read-only.
        </Notice>
      )}
      <div className={css["actions"]}>
        {owned ? (
          <>
            <Button
              data-testid="view-edit"
              disabled={isReadOnly}
              onClick={onEdit}
              size="full"
            >
              <PencilIcon /> Edit
            </Button>
            <Dialog
              onOpenChange={onUpgradeModalOpenChange}
              open={upgradeModalOpen}
            >
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
          </>
        ) : (
          <Button size="full" onClick={onImport}>
            <ImportIcon /> Import deck to collection
          </Button>
        )}
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
              <EllipsisIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <DropdownMenu>
              {owned && (
                <>
                  <Button
                    data-testid="view-duplicate"
                    onClick={onDuplicate}
                    size="full"
                    variant="bare"
                  >
                    <CopyIcon />
                    Duplicate
                  </Button>
                  <hr />
                </>
              )}
              <Button
                data-testid="view-export-json"
                size="full"
                variant="bare"
                onClick={onExportJson}
              >
                <DownloadIcon /> Export JSON
              </Button>
              <Button
                data-testid="view-export-text"
                size="full"
                variant="bare"
                onClick={onExportText}
              >
                <DownloadIcon /> Export Markdown
              </Button>
              {owned && (
                <>
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
                    <Trash2Icon /> Delete
                  </Button>
                </>
              )}
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

function Sharing(props: Props) {
  const { deck } = props;
  const toast = useToast();

  const share = useStore((state) => state.sharing.decks[props.deck.id]);

  const createShare = useStore((state) => state.createShare);
  const deleteShare = useStore((state) => state.deleteShare);
  const updateShare = useStore((state) => state.updateShare);

  async function withToast(fn: () => Promise<unknown>, action: string) {
    const id = toast.show({
      children: `${capitalize(action)} share...`,
    });

    try {
      await fn();
      toast.dismiss(id);
      toast.show({
        children: `Share ${action} successful`,
        variant: "success",
        duration: 3000,
      });
    } catch (err) {
      toast.dismiss(id);
      toast.show({
        children: `Failed to ${action} share: ${(err as Error).message}`,
        variant: "error",
      });
    }
  }

  const onCreateShare = async () => {
    await withToast(() => createShare(deck.id as string), "create");
  };

  const onDeleteShare = async () => {
    await withToast(() => deleteShare(deck.id as string), "delete");
  };

  const onUpdateShare = async () => {
    await withToast(() => updateShare(deck.id as string), "update");
  };

  const isReadOnly = !!deck.next_deck;

  return (
    <section className={css["details"]} data-testid="share">
      <div className={cx(css["detail"], css["full"])}>
        <header>
          <h3 className={css["detail-label"]}>
            <ShareIcon />
            Public share
          </h3>
        </header>
        <div className={css["detail-value"]}>
          {share ? (
            <div className={css["share"]}>
              <p>
                This deck has a public share, it can be viewed using this{" "}
                <a
                  data-testid="share-link"
                  href={`/share/${deck.id}`}
                  target="_blank"
                  rel="noreferrer "
                >
                  link
                </a>
                .
              </p>
              <p>
                Deck id: <code>{deck.id}</code>
              </p>
              <nav className={css["share-actions"]}>
                {deck.date_update !== share && (
                  <Button
                    disabled={isReadOnly}
                    onClick={onUpdateShare}
                    size="sm"
                    tooltip="Share is outdated."
                  >
                    Update share
                  </Button>
                )}
                <Button size="sm" onClick={onDeleteShare}>
                  Delete share
                </Button>
              </nav>
            </div>
          ) : (
            <div className={css["share-empty"]}>
              <p>Not shared.</p>
              <Button
                data-testid="share-create"
                disabled={isReadOnly}
                onClick={onCreateShare}
                size="sm"
                tooltip={
                  <>
                    Sharing creates a publicly accessible, read-only link to the
                    deck. Anyone with the link can view the deck, but not edit
                    it.
                    <br />
                    Shares can be removed at any time. Removing a share does not
                    affect the deck itself.
                    <br />
                    <strong>Note:</strong> For security reasons, deck notes are
                    not part of the share.
                  </>
                }
              >
                Share deck
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
