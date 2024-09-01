import { Save } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";

import type { ResolvedDeck } from "@/store/lib/types";
import type { Tab } from "@/store/slices/deck-edits.types";
import { useHotKey } from "@/utils/use-hotkey";
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
  const discardEdits = useStore((state) => state.discardEdits);
  const saveDeck = useStore((state) => state.saveDeck);
  const updateShare = useStore((state) => state.updateShare);

  const onSave = useCallback(
    async (stayOnPage?: boolean) => {
      const id = saveDeck(deck.id);

      toast.show({
        children: "Deck save successful.",
        duration: 3000,
        variant: "success",
      });

      const toastId = toast.show({
        children: "Updating share...",
      });

      try {
        await updateShare(deck.id as string);

        toast.dismiss(toastId);

        toast.show({
          children: "Share update successful.",
          duration: 3000,
          variant: "success",
        });
      } catch (err) {
        toast.dismiss(toastId);

        toast.show({
          children: `Share could not be updated: ${(err as Error)?.message}. Try again later on the deck page.`,
          variant: "error",
        });
      }

      if (!stayOnPage) navigate(`/deck/view/${id}`);
    },
    [saveDeck, navigate, deck.id, toast, updateShare],
  );

  const onDiscard = useCallback(
    (stayOnPage?: boolean) => {
      const confirmed =
        !hasEdits ||
        window.confirm("Are you sure you want to discard your changes?");
      if (confirmed) {
        discardEdits(deck.id);
        if (!stayOnPage) navigate(`/deck/view/${deck.id}`);
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

  return (
    <>
      <LatestUpgrade currentTab={currentTab} deck={deck} overflowScroll />
      <div className={css["actions"]}>
        <Button
          onClick={() => {
            onSave();
          }}
          variant="primary"
        >
          <Save />
          Save
        </Button>
        <Button
          onClick={() => {
            onDiscard();
          }}
          variant="bare"
        >
          Discard edits
        </Button>
      </div>
    </>
  );
}
