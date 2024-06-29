import { Save } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { useAccentColor } from "@/utils/use-accent-color";

import { useHotKey } from "@/utils/use-hotkey";
import css from "./editor.module.css";

type Props = {
  deck: DisplayDeck;
};

export function EditorActions({ deck }: Props) {
  const [, navigate] = useLocation();
  const showToast = useToast();
  const cssVariables = useAccentColor(
    deck.cards.investigator.card.faction_code,
  );

  const hasEdits = useStore((state) => !!state.deckEdits[deck.id]);
  const discardEdits = useStore((state) => state.discardEdits);
  const saveDeck = useStore((state) => state.saveDeck);

  const onSave = useCallback(
    (stayOnPage?: boolean) => {
      const id = saveDeck(deck.id);

      if (!stayOnPage) navigate(`/deck/view/${id}`);

      showToast({
        children: "Deck saved successfully.",
        duration: 2000,
        variant: "success",
      });
    },
    [saveDeck, navigate, showToast, deck.id],
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

  const onQuicksave = useCallback(() => {
    onSave(true);
  }, [onSave]);

  const onQuickDiscard = useCallback(() => {
    onDiscard(true);
  }, [onDiscard]);

  useHotKey("cmd+s", onQuicksave, [onQuicksave]);
  useHotKey("cmd+backspace", onQuickDiscard, [onDiscard]);

  return (
    <div className={css["actions"]} style={cssVariables}>
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
  );
}
