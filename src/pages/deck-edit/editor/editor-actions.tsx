import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectConnectionLockForDeck } from "@/store/selectors/shared";
import type { Tab } from "@/store/slices/deck-edits.types";
import { useHotKey } from "@/utils/use-hotkey";
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
          children: `Deck save failed: ${(err as Error)?.message || "Unknown error"}.`,
          variant: "error",
        });
      }
    },
    [saveDeck, navigate, deck.id, toast],
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

  const onQuicksave = useCallback(
    (evt: KeyboardEvent) => {
      onSave(!evt.shiftKey);
    },
    [onSave],
  );

  const onQuickDiscard = useCallback(
    (evt: KeyboardEvent) => {
      onDiscard(!evt.shiftKey);
    },
    [onDiscard],
  );

  useHotKey("cmd+s", onQuicksave, [onQuicksave]);
  useHotKey("cmd+backspace", onQuickDiscard, [onDiscard]);

  const readonly = !!deck.next_deck;

  return (
    <>
      <LatestUpgrade currentTab={currentTab} deck={deck} overflowScroll />
      <div className={css["actions"]}>
        <Button
          data-testid="editor-save"
          onClick={() => {
            onSave();
          }}
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
        <Button
          data-testid="editor-discard"
          onClick={() => {
            onDiscard();
          }}
          variant="bare"
        >
          <Undo2Icon />
          Discard edits
        </Button>
      </div>
    </>
  );
}
