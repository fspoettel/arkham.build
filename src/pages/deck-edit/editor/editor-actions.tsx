import { Save } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { useAccentColor } from "@/utils/use-accent-color";

import type { ResolvedDeck } from "@/store/lib/types";
import { useHotKey } from "@/utils/use-hotkey";
import css from "./editor.module.css";

type Props = {
  deck: ResolvedDeck;
};

export function EditorActions(props: Props) {
  const { deck } = props;

  const [, navigate] = useLocation();
  const showToast = useToast();
  const cssVariables = useAccentColor(
    deck.cards.investigator.card.faction_code,
  );

  const hasEdits = useStore((state) => !!state.deckEdits[deck.id]);
  const discardEdits = useStore((state) => state.discardEdits);
  const saveDeck = useStore((state) => state.saveDeck);

  const onSave = useCallback(
    async (stayOnPage?: boolean) => {
      const id = await saveDeck(deck.id);

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
