import { DeckInvestigator } from "@/components/deck-investigator/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownButton, DropdownMenu } from "@/components/ui/dropdown-menu";
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
import { selectConnections } from "@/store/selectors/connections";
import {
  selectConnectionLock,
  selectConnectionLockForDeck,
} from "@/store/selectors/shared";
import { cx } from "@/utils/cx";
import {
  capitalize,
  capitalizeSnakeCase,
  formatTabooSet,
} from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { useHotkey } from "@/utils/use-hotkey";
import {
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  ImportIcon,
  PencilIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useCardModalContext } from "../card-modal/card-modal-context";
import { DeckInvestigatorModal } from "../deck-investigator/deck-investigator-modal";
import { CopyToClipboard } from "../ui/copy-to-clipboard";
import { useDialogContextChecked } from "../ui/dialog.hooks";
import { HotkeyTooltip } from "../ui/hotkey";
import { LatestUpgrade } from "./deck-history/latest-upgrade";
import {
  useDeleteDeck,
  useDeleteUpgrade,
  useDuplicateDeck,
  useExportJson,
  useExportText,
  useUploadDeck,
} from "./hooks";
import css from "./sidebar.module.css";
import type { DeckOrigin } from "./types";

type Props = {
  className?: string;
  origin: DeckOrigin;
  deck: ResolvedDeck;
};

export function Sidebar(props: Props) {
  const { className, origin, deck } = props;

  const dialogContext = useDialogContextChecked();
  const cardModalContext = useCardModalContext();

  const connections = useStore(selectConnections);

  const uploadDeck = useUploadDeck();
  const onUpload = useCallback(() => {
    uploadDeck(deck.id);
  }, [deck.id, uploadDeck]);

  useEffect(() => {
    if (cardModalContext.isOpen) {
      dialogContext?.setOpen(false);
    }
  }, [cardModalContext.isOpen, dialogContext.setOpen]);

  const isReadOnly = !!deck.next_deck;

  const canUploadToArkhamDb =
    origin === "local" &&
    !isReadOnly &&
    deck.source !== "arkhamdb" &&
    !isEmpty(connections);

  const onArkhamDBUpload = canUploadToArkhamDb ? onUpload : undefined;

  return (
    <div className={cx(css["container"], className)}>
      <DeckInvestigator deck={deck} size="tooltip" titleLinks="dialog" />
      <DialogContent>
        <DeckInvestigatorModal
          deck={deck}
          onCloseModal={() => dialogContext?.setOpen(false)}
          readonly
        />
      </DialogContent>

      <SidebarActions
        onArkhamDBUpload={onArkhamDBUpload}
        deck={deck}
        origin={origin}
      />
      <SidebarDetails deck={deck} />
      {origin === "local" && <SidebarUpgrade deck={deck} />}
      {origin === "local" && deck.source !== "arkhamdb" && (
        <Sharing onArkhamDBUpload={onArkhamDBUpload} deck={deck} />
      )}
      {origin === "arkhamdb" ||
        (deck.source === "arkhamdb" && <ArkhamDbDetails deck={deck} />)}
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
    <section className={css["details"]} data-testid="view-latest-upgrade">
      <div className={cx(css["detail"], css["full"])}>
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

function SidebarActions(props: {
  origin: DeckOrigin;
  deck: ResolvedDeck;
  onArkhamDBUpload?: () => void;
}) {
  const { origin, deck, onArkhamDBUpload } = props;

  const [, navigate] = useLocation();
  const search = useSearch();
  const toast = useToast();

  const [actionsOpen, setActionsOpen] = useState(false);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(
    origin === "local" && search.includes("upgrade") && !deck.next_deck,
  );

  const connectionLock = useStore(selectConnectionLock);

  const deckConnectionLock = useStore((state) =>
    selectConnectionLockForDeck(state, deck),
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

  const onDeleteLatest = useCallback(() => {
    if (deck.previous_deck) {
      deleteUpgrade(deck.id);
    } else {
      onDelete();
    }
  }, [deleteUpgrade, onDelete, deck]);

  const exportJson = useExportJson();

  const onExportJson = useCallback(
    () => exportJson(deck.originalDeck),
    [deck, exportJson],
  );

  const exportText = useExportText();

  const onExportText = useCallback(() => exportText(deck), [deck, exportText]);

  const duplicateDeck = useDuplicateDeck();

  const onDuplicate = useCallback(() => {
    setActionsOpen(false);
    duplicateDeck(deck.id);
  }, [deck.id, duplicateDeck]);

  const onUpgradeModalOpenChange = useCallback((val: boolean) => {
    setUpgradeModalOpen(val);
    if (!val && window.location.hash.includes("upgrade")) {
      history.replaceState(null, "", " ");
    }
  }, []);

  const onOpenUpgradeModal = useCallback(() => {
    setUpgradeModalOpen(true);
  }, []);

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

  const isReadOnly = !!deck.next_deck;

  useHotkey("e", onEdit, { disabled: isReadOnly });
  useHotkey("u", onOpenUpgradeModal, { disabled: isReadOnly });
  useHotkey("cmd+backspace", onDelete, { disabled: isReadOnly });
  useHotkey("cmd+shift+backspace", onDeleteLatest, { disabled: isReadOnly });
  useHotkey("i", onImport, { disabled: origin === "local" });
  useHotkey("cmd+d", onDuplicate);
  useHotkey("cmd+shift+j", onExportJson);
  useHotkey("cmd+shift+t", onExportText);

  return (
    <>
      {isReadOnly && (
        <Notice variant="info">
          There is a{" "}
          <Link
            href={`${origin !== "share" ? "/deck/view/" : "/share/"}${deck.next_deck}`}
          >
            newer version
          </Link>{" "}
          of this deck. {origin === "local" && "This deck is read-only."}
        </Notice>
      )}
      <div className={css["actions"]}>
        {origin === "local" ? (
          <>
            <HotkeyTooltip keybind="e" description="Edit deck">
              <Button
                data-testid="view-edit"
                disabled={isReadOnly}
                onClick={onEdit}
                size="full"
              >
                <PencilIcon /> Edit
              </Button>
            </HotkeyTooltip>
            <Dialog
              onOpenChange={onUpgradeModalOpenChange}
              open={upgradeModalOpen}
            >
              <HotkeyTooltip keybind="u" description="Upgrade deck">
                <DialogTrigger asChild>
                  <Button
                    data-testid="view-upgrade"
                    disabled={isReadOnly}
                    size="full"
                  >
                    <i className="icon-xp-bold" /> Upgrade
                  </Button>
                </DialogTrigger>
              </HotkeyTooltip>
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
              {origin === "local" && (
                <>
                  <DropdownButton
                    hotkey="cmd+d"
                    data-testid="view-duplicate"
                    onClick={onDuplicate}
                  >
                    <CopyIcon />
                    Duplicate
                  </DropdownButton>
                  <hr />
                </>
              )}
              {onArkhamDBUpload && (
                <>
                  <Button
                    data-testid="view-upload"
                    disabled={!!connectionLock}
                    size="full"
                    tooltip={connectionLock}
                    variant="bare"
                    onClick={onArkhamDBUpload}
                  >
                    <i className="icon-elder_sign" /> Upload to ArkhamDB
                  </Button>
                  <hr />
                </>
              )}
              <DropdownButton
                data-testid="view-export-json"
                hotkey="cmd+shift+j"
                onClick={onExportJson}
              >
                <DownloadIcon /> Export JSON
              </DropdownButton>
              <DropdownButton
                data-testid="view-export-text"
                hotkey="cmd+shift+t"
                onClick={onExportText}
              >
                <DownloadIcon /> Export text
              </DropdownButton>
              {origin === "local" && (
                <>
                  <hr />
                  {!!deck.previous_deck && (
                    <DropdownButton
                      data-testid="view-delete-upgrade"
                      disabled={isReadOnly || !!deckConnectionLock}
                      hotkey="cmd+shift+backspace"
                      onClick={onDeleteUpgrade}
                      tooltip={deckConnectionLock}
                    >
                      <i className="icon-xp-bold" /> Delete upgrade
                    </DropdownButton>
                  )}
                  <DropdownButton
                    data-testid="view-delete"
                    disabled={isReadOnly || !!deckConnectionLock}
                    hotkey="cmd+backspace"
                    onClick={onDelete}
                    tooltip={deckConnectionLock}
                  >
                    <Trash2Icon /> Delete
                  </DropdownButton>
                </>
              )}
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

function Sharing(props: { onArkhamDBUpload?: () => void; deck: ResolvedDeck }) {
  const { deck, onArkhamDBUpload } = props;
  const toast = useToast();

  const deckData = useStore((state) => state.data.decks[props.deck.id]);
  const share = useStore((state) => state.sharing.decks[props.deck.id]);

  const connectionLock = useStore(selectConnectionLock);

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
    await withToast(() => updateShare(deckData), "update");
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
                <CopyToClipboard
                  text={`${window.location.origin}/share/${deck.id}`}
                />
              </p>
              <p>
                Deck ID: <code>{deck.id}</code>
                <CopyToClipboard text={`${deck.id}`} />
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
              <p>Deck is stored locally.</p>
              <div className={css["share-actions"]}>
                <Button
                  data-testid="share-create"
                  disabled={isReadOnly}
                  onClick={onCreateShare}
                  size="sm"
                  tooltip={
                    <>
                      Sharing creates a publicly accessible, read-only link to
                      the deck. Anyone with the link can view the deck, but not
                      edit it.
                      <br />
                      Shares can be removed at any time. Removing a share does
                      not affect the deck itself.
                      <br />
                      <strong>Note:</strong> For security reasons, deck notes
                      are not part of the share.
                    </>
                  }
                >
                  <ShareIcon />
                  Create public share
                </Button>
                {onArkhamDBUpload && (
                  <Button
                    data-testid="view-upload"
                    disabled={!!connectionLock}
                    onClick={onArkhamDBUpload}
                    tooltip={connectionLock}
                    size="sm"
                  >
                    <i className="icon-elder_sign" /> Upload to ArkhamDB
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ArkhamDbDetails(props: { deck: ResolvedDeck }) {
  const { deck } = props;
  return (
    <section className={css["details"]} data-testid="share">
      <div className={cx(css["detail"], css["full"])}>
        <header>
          <h3 className={css["detail-label"]}>
            <i className="icon-elder_sign" />
            ArkhamDB
          </h3>
        </header>
        <div className={css["detail-value"]}>
          <p>This deck is set up to sync with ArkhamDB.</p>
          <p>
            Deck ID: <code>{deck.id}</code>
            <CopyToClipboard text={`${deck.id}`} />
          </p>
          <Button
            as="a"
            href={`${import.meta.env.VITE_ARKHAMDB_BASE_URL}/deck/view/${deck.id}`}
            size="sm"
            rel="noreferrer"
            target="_blank"
          >
            View on ArkhamDB
          </Button>
        </div>
      </div>
    </section>
  );
}
