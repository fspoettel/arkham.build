import { Button } from "@/components/ui/button";
import { HotkeyTooltip } from "@/components/ui/hotkey";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import { PreviewPublishError } from "@/store/lib/errors";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectConnectionLockForDeck } from "@/store/selectors/shared";
import type { Tab } from "@/store/slices/deck-edits.types";
import { useHotkey } from "@/utils/use-hotkey";
import { SaveIcon, Undo2Icon } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";
import { LatestUpgrade } from "../../../components/deck-display/deck-history/latest-upgrade";
import css from "./editor.module.css";

type Props = {
  currentTab: Tab;
  deck: ResolvedDeck;
};

export function EditorActions(props: Props) {
  const { currentTab, deck } = props;

  const [, navigate] = useLocation();
  const toast = useToast();

  const hasEdits = useStore((state) => !!state.deckEdits[deck.id]);
  const connectionLock = useStore((state) =>
    selectConnectionLockForDeck(state, deck),
  );

  const discardEdits = useStore((state) => state.discardEdits);
  const saveDeck = useStore((state) => state.saveDeck);
  const duplicateDeck = useStore((state) => state.duplicateDeck);

  const onduplicateWithEdits = useCallback(() => {
    const id = duplicateDeck(deck.id, { applyEdits: true });
    navigate(`~/deck/view/${id}`);
  }, [duplicateDeck, deck.id, navigate]);

  const onSave = useCallback(
    async (stayOnPage?: boolean) => {
      const toastId = toast.show({
        children: "Updating deck",
        variant: "loading",
      });

      try {
        const id = await saveDeck(deck.id);
        toast.dismiss(toastId);

        toast.show({
          children: "Deck save successful.",
          duration: 3000,
          variant: "success",
        });

        if (!stayOnPage) navigate(`~/deck/view/${id}`);
      } catch (err) {
        toast.dismiss(toastId);

        toast.show({
          children: (
            <>
              <p>
                Deck save failed: {(err as Error)?.message || "Unknown error"}.
              </p>
              {err instanceof PreviewPublishError && (
                <Button
                  className={css["error-action"]}
                  onClick={onduplicateWithEdits}
                  size="sm"
                  tooltip="Create a local copy of this deck. This will apply all outstanding edits and allow you to save them. Upgrades and deck history will not be carried over."
                >
                  Create local copy
                </Button>
              )}
            </>
          ),
          variant: "error",
        });
      }
    },
    [saveDeck, navigate, deck.id, toast, onduplicateWithEdits],
  );

  const onDiscard = useCallback(
    (stayOnPage?: boolean) => {
      const confirmed =
        !hasEdits ||
        window.confirm("Are you sure you want to discard your changes?");
      if (confirmed) {
        discardEdits(deck.id);
        if (!stayOnPage) navigate(`~/deck/view/${deck.id}`);
      }
    },
    [discardEdits, navigate, deck.id, hasEdits],
  );

  const onQuicksave = useCallback(() => onSave(true), [onSave]);
  const onQuickDiscard = useCallback(() => onDiscard(true), [onDiscard]);

  const onSaveClose = useCallback(() => onSave(false), [onSave]);
  const onDiscardClose = useCallback(() => onDiscard(false), [onDiscard]);

  useHotkey("cmd+s", onSaveClose, {
    allowInputFocused: true,
  });

  useHotkey("cmd+shift+s", onQuicksave, {
    allowInputFocused: true,
  });

  useHotkey("cmd+backspace", onDiscardClose);
  useHotkey("cmd+shift+backspace", onQuickDiscard);

  const readonly = !!deck.next_deck;

  return (
    <>
      <LatestUpgrade currentTab={currentTab} deck={deck} overflowScroll />
      <div className={css["actions"]}>
        <HotkeyTooltip keybind="cmd+s" description="Save deck">
          <Button
            data-testid="editor-save"
            onClick={onSaveClose}
            disabled={!!connectionLock || readonly}
            tooltip={
              connectionLock
                ? connectionLock
                : readonly
                  ? "This deck has an upgrade and is read-only."
                  : undefined
            }
            variant="primary"
          >
            <SaveIcon />
            Save
          </Button>
        </HotkeyTooltip>
        <HotkeyTooltip keybind="cmd+backspace" description="Discard edits">
          <Button
            data-testid="editor-discard"
            onClick={onDiscardClose}
            variant="bare"
          >
            <Undo2Icon />
            Discard edits
          </Button>
        </HotkeyTooltip>
      </div>
    </>
  );
}
